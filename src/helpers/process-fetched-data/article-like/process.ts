import produce from "immer"
import { filterAndMapEntitiesById, findEntityById, mapIds } from "^helpers/data"
import {
  SanitisedArticle,
  SanitisedBlog,
  Image,
  TextSection,
  ImageSection,
  VideoSection,
  ArticleLikeSummaryType,
  Author,
} from "^types/entities"
import { DeepRequired, MakeRequired, MyOmit } from "^types/utilities"
import { getArticleLikeDocumentImageIds, getArticleLikeSummary } from "./query"
import { validateTranslation } from "./validate"

type ProcessedTranslationBody =
  | MakeRequired<TextSection, "text">
  | DeepRequired<ImageSection, ["image", "imageId"]>
  | MakeRequired<VideoSection, "youtubeId">

type ProcessedTranslationForOwnPage = MakeRequired<
  MyOmit<SanitisedArticle["translations"][number], "body">,
  "title"
> & {
  body: ProcessedTranslationBody[]
}

export function processArticleLikeEntityForOwnPage<
  TEntity extends SanitisedArticle | SanitisedBlog
>({
  entity,
  validLanguageIds,
  validImages,
}: {
  entity: TEntity
  validLanguageIds: string[]
  validImages: Image[]
}) {
  // remove invalid translations; remove empty translation sections.
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
          if (
            !section.image.imageId ||
            !mapIds(validImages).includes(section.image.imageId)
          ) {
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
  }) as ProcessedTranslationForOwnPage[]

  const collatedTranslationsData = processedTranslations.map((translation) => {
    const { body, ...restOfTranslation } = translation

    const bodyCollated = body.map((section) => {
      if (section.type !== "image") {
        return section
      }

      const { image, ...restOfSection } = section
      const { imageId, ...restOfImage } = image

      return {
        ...restOfSection,
        image: {
          ...restOfImage,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          storageImage: validImages.find((image) => image.id === imageId)!,
        },
      }
    })

    return {
      ...restOfTranslation,
      body: bodyCollated,
    }
  })

  const processed = {
    id: entity.id,
    publishDate: entity.publishDate,
    translations: collatedTranslationsData,
  }

  return processed
}

type AsSummaryValidTranslation = MakeRequired<
  SanitisedArticle["translations"][number],
  "title"
>

export type ArticleLikeEntityAsSummary = ReturnType<
  typeof processArticleLikeEntityAsSummary
>

export function processArticleLikeEntityAsSummary<
  TEntity extends SanitisedArticle | SanitisedBlog
>({
  entity,
  validLanguageIds,
  validImages,
  summaryType = "default",
  validAuthors,
}: {
  entity: TEntity
  validLanguageIds: string[]
  validImages: Image[]
  validAuthors: Author[]
  summaryType?: ArticleLikeSummaryType
}) {
  let summaryImage: Image | null = null

  if (entity.summaryImage.useImage !== false) {
    if (entity.summaryImage.imageId) {
      const storageImage = findEntityById(
        validImages,
        entity.summaryImage.imageId
      )
      if (storageImage) {
        summaryImage = storageImage
      }
    } else {
      const documentImageIds = getArticleLikeDocumentImageIds(
        entity.translations
      )
      documentImageIds.some((imageId) => {
        const storageImage = findEntityById(validImages, imageId)
        if (storageImage) {
          summaryImage = storageImage
        }

        return storageImage
      })
    }
  }

  const validTranslations = entity.translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as AsSummaryValidTranslation[]

  const processedTranslations = validTranslations.map((translation) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const summaryText = getArticleLikeSummary(translation, summaryType)!

    return {
      title: translation.title,
      summaryText,
      languageId: translation.languageId,
    }
  })

  const processed = {
    id: entity.id,
    publishDate: entity.publishDate,
    type: entity.type,
    summaryImage: summaryImage
      ? {
          vertPosition: entity.summaryImage.vertPosition,
          storageImage: summaryImage,
        }
      : null,
    translations: processedTranslations,
    authors: filterAndMapEntitiesById(entity.authorsIds, validAuthors),
  }

  return processed
}
