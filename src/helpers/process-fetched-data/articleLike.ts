import produce from "immer"
import {
  ArticleLikeTranslation,
  ArticleLikeChildEntitiesKeysTuple,
  ArticleLikeChildEntityFields,
  SanitisedArticle,
  SanitisedBlog,
  Author,
  SanitisedCollection,
  SanitisedSubject,
  Tag,
  TextSection,
  ImageSection,
  VideoSection,
} from "^types/entities"
import { DeepRequired, MakeRequired, MyOmit } from "^types/utilities"

export function getArticleLikeDocumentImageIds(
  articleLikeTranslations: ArticleLikeTranslation[]
) {
  const imageIds = articleLikeTranslations
    .flatMap((t) => t.body)
    .flatMap((s) => (s.type === "image" ? [s] : []))
    .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []))

  const unique = Array.from(new Set(imageIds).values())

  return unique
}

const checkTranslationHasText = (translation: ArticleLikeTranslation) => {
  const textSections = translation.body.flatMap((section) =>
    section.type === "text" ? [section] : []
  )

  const isSectionWithText = textSections.find((s) => s.text?.length)

  return Boolean(isSectionWithText)
}

function validateTranslation(
  translation: ArticleLikeTranslation,
  languageIds: string[]
) {
  if (!languageIds.includes(translation.languageId)) {
    return false
  }
  if (!translation.title?.length) {
    return false
  }
  if (!checkTranslationHasText(translation)) {
    return false
  }
  return true
}

export function validateArticleLikeEntity<
  TEntity extends SanitisedArticle | SanitisedBlog
>(entity: TEntity, validLanguageIds: string[]): boolean {
  const validTranslation = entity.translations.find((translation) =>
    validateTranslation(translation, validLanguageIds)
  )

  if (!validTranslation) {
    return false
  }

  return true
}
export function filterValidArticleLikeEntities<
  TEntity extends SanitisedArticle | SanitisedBlog
>(entities: TEntity[], validLanguageIds: string[]) {
  return entities.filter((entity) =>
    validateArticleLikeEntity(entity, validLanguageIds)
  )
}

const removeInvalidChildEntityIds = ({
  childEntityIdArr,
  validIdArr,
}: {
  childEntityIdArr: string[]
  validIdArr: string[]
}) => {
  childEntityIdArr.forEach((id, i) => {
    if (!validIdArr.includes(id)) {
      childEntityIdArr.splice(i, 1)
    }
  })
}

/**Used within getStaticProps after validation has occurred in getStaticPaths; remove invalid translations and child entities.*/
export function processValidatedArticleLikeEntity<
  TEntity extends SanitisedArticle | SanitisedBlog
>({
  entity,
  validLanguageIds,
  validRelatedEntitiesIds,
}: {
  entity: TEntity
  validLanguageIds: string[]
  validRelatedEntitiesIds: ArticleLikeChildEntityFields
}) {
  const processed = produce(entity, (draft) => {
    for (let i = 0; i < draft.translations.length; i++) {
      const translation = draft.translations[i]
      // remove invalid translations: start ---
      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        const translationIndex = draft.translations.findIndex(
          (t) => t.id === translation.id
        )
        draft.translations.splice(translationIndex, 1)
      }
      // remove invalid translations: end ---
    }

    const articleLikeChildKeysArr: ArticleLikeChildEntitiesKeysTuple = [
      "authorsIds",
      "collectionsIds",
      "subjectsIds",
      "tagsIds",
    ]

    articleLikeChildKeysArr.forEach((key) =>
      removeInvalidChildEntityIds({
        childEntityIdArr: draft[key],
        validIdArr: validRelatedEntitiesIds[key],
      })
    )
  })

  return processed
}

type ProcessedTranslationBody =
  | MakeRequired<TextSection, "text">
  | DeepRequired<ImageSection, ["image", "imageId"]>
  | MakeRequired<VideoSection, "youtubeId">

type ProcessedTranslation = MyOmit<ArticleLikeTranslation, "body"> & {
  body: ProcessedTranslationBody[]
}

export function processArticleLikeEntityForOwnPage<
  TEntity extends SanitisedArticle | SanitisedBlog
>({
  entity,
  validLanguageIds,
  validRelatedEntities,
}: {
  entity: TEntity
  validLanguageIds: string[]
  validRelatedEntities: {
    authors: Author[]
    collections: SanitisedCollection[]
    subjects: SanitisedSubject[]
    tags: Tag[]
  }
}) {
  const processedTranslations = produce(entity.translations, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const translation = draft[i]

      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        // const translationIndex = draft.findIndex((t) => t.id === translation.id)
        draft.splice(i, 1)
        break
      }

      for (let j = 0; j < translation.body.length; j++) {
        const section = translation.body[j]
        // const index = translation.body.findIndex((s) => s.id === section.id)
        if (section.type === "image") {
          if (!section.image.imageId) {
            translation.body.splice(j, 1)
          }
          break
        }
        if (section.type === "text") {
          if (!section.text?.length) {
            translation.body.splice(j, 1)
          }
          break
        }
        if (section.type === "video") {
          if (!section.youtubeId) {
            translation.body.splice(j, 1)
          }
        }
      }
    }
  }) as ProcessedTranslation[]

  const processed = {
    id: entity.id,
    translations: processedTranslations,
    ...validRelatedEntities,
  }

  return processed
}
