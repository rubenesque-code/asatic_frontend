import produce from "immer"
import { filterAndMapEntitiesById, findEntityById, mapIds } from "^helpers/data"
import { SanitisedArticle, SanitisedBlog, Image, Author } from "^types/entities"
import { MakeRequired } from "^types/utilities"
import {
  getArticleLikeDocumentImageIds,
  getArticleLikeSummaryText,
} from "./query"
import { validateTranslation } from "./validate"

export function processArticleLikeEntityForOwnPage<
  TEntity extends SanitisedArticle | SanitisedBlog
>(
  entity: TEntity,
  {
    validLanguageIds,
    validImages,
  }: {
    validLanguageIds: string[]
    validImages: Image[]
  }
) {
  const translationsProcessed = entity.translations
    .filter((translation) => validateTranslation(translation, validLanguageIds))
    .map((translation) => ({
      id: translation.id,
      languageId: translation.languageId,
      body: translation.body,
      title: translation.title as string,
    }))
    .map((translation) =>
      produce(translation, (draft) => {
        for (let j = 0; j < translation.body.length; j++) {
          const bodySection = draft.body[j]

          if (bodySection.type === "image") {
            if (
              !bodySection.image.imageId ||
              !mapIds(validImages).includes(bodySection.image.imageId)
            ) {
              draft.body.splice(j, 1)
            }
            break
          } else if (bodySection.type === "text") {
            if (!bodySection.text?.length) {
              draft.body.splice(j, 1)
            }
            break
          } else {
            if (!bodySection.youtubeId) {
              draft.body.splice(j, 1)
            }
          }
        }
      })
    )
    .map((translation) => {
      const { body, ...restOfTranslation } = translation

      const translationBodyDataMerged = body.map((section) => {
        if (section.type !== "image") {
          return section
        }

        const { image, ...restOfSection } = section
        const { imageId, ...restOfImage } = image

        return {
          ...restOfSection,
          image: {
            ...restOfImage,
            storageImage:
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              validImages.find((image) => image.id === imageId)!,
          },
        }
      })

      return {
        ...restOfTranslation,
        body: translationBodyDataMerged,
      }
    })

  const articleProcessed = {
    id: entity.id,
    publishDate: entity.publishDate,
    translations: translationsProcessed,
  }

  return articleProcessed
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
  validAuthors,
}: {
  entity: TEntity
  validLanguageIds: string[]
  validImages: Image[]
  validAuthors: Author[]
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
    const summaryText = getArticleLikeSummaryText(translation)!

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
