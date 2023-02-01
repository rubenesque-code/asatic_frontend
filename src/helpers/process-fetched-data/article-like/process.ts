import produce from "immer"
import DOMPurify from "isomorphic-dompurify"

import { filterAndMapEntitiesById, findEntityById, mapIds } from "^helpers/data"
import { SanitisedArticle, SanitisedBlog, Image } from "^types/entities"
import { MakeRequired } from "^types/utilities"
import {
  getArticleLikeDocumentImageIds,
  getArticleLikeSummaryText,
} from "./query"
import { validateTranslation } from "./validate"
import { processAuthorsAsChildren } from "../author/process"

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      title: DOMPurify.sanitize(translation.title!),
    }))
    .map((translation) =>
      produce(translation, (draft) => {
        // · remove invalid sections
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
          } else if (bodySection.type === "video") {
            if (!bodySection.youtubeId) {
              draft.body.splice(j, 1)
            }
          } else {
            const { columns, rows } = bodySection
            if (!columns.length || !rows.length) {
              draft.body.splice(j, 1)
            }
          }
        }
      })
    )
    .map((translation) => {
      // · merge data · sanitise text
      const { body, ...restOfTranslation } = translation

      const textSections = body.flatMap((s) => (s.type === "text" ? [s] : []))

      /*       const text = textSections.flatMap((s) => (s.text ? [s.text] : [])).join()
      const regex = new RegExp(/<(sup).*?id="([^"]*?)".*?>(.+?)<\/\1>/gi)
      const footnoteTagIds = text.match(regex)?.flatMap((match) => {
        const a = regex.exec(match)
        const id = a ? a[2] : null

        return id ? [id] : []
      }) */

      const footnotesText = textSections
        .flatMap((s) => (s.footnotes ? s.footnotes : []))
        .map((footnote, i) => ({
          ...footnote,
          num: i + 1,
          text: DOMPurify.sanitize(footnote.text),
        }))

      const translationBodyDataMerged = body.map((section) => {
        if (section.type === "text") {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { text, footnotes, ...restOfSection } = section
          return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            text: DOMPurify.sanitize(text!),
            ...restOfSection,
          }
        } else if (section.type === "video") {
          const { caption, ...restOfSection } = section

          return {
            ...(caption && { caption: DOMPurify.sanitize(caption) }),
            ...restOfSection,
          }
        } else if (section.type === "image") {
          const { image, caption, ...restOfSection } = section
          const { imageId, ...restOfImage } = image

          return {
            ...restOfSection,
            ...(caption && { caption: DOMPurify.sanitize(caption) }),
            image: {
              ...restOfImage,
              storageImage:
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                validImages.find((image) => image.id === imageId)!,
            },
          }
        } else {
          const { columns, rows, notes, title, ...restOfSection } = section

          return {
            ...restOfSection,
            columns: columns.map((column) => ({
              ...column,
              Header: DOMPurify.sanitize(column.Header),
            })),
            rows: rows.map((row) => {
              const keys = Object.keys(row)
              const arr = keys.map((key) => [key, DOMPurify.sanitize(row[key])])
              const newObj = Object.fromEntries(arr) as typeof row

              return newObj
            }),
            notes: notes ? DOMPurify.sanitize(notes) : notes,
            title: title ? DOMPurify.sanitize(title) : title,
          }
        }
      })

      return {
        ...restOfTranslation,
        body: translationBodyDataMerged,
        footnotesText,
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
>(
  entity: TEntity,
  {
    validLanguageIds,
    validImages,
    processedAuthors,
  }: {
    validLanguageIds: string[]
    validImages: Image[]
    processedAuthors: ReturnType<typeof processAuthorsAsChildren>
  }
) {
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
    const summaryText = DOMPurify.sanitize(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getArticleLikeSummaryText(translation)!
    )

    return {
      title: DOMPurify.sanitize(translation.title),
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
    authors: filterAndMapEntitiesById(entity.authorsIds, processedAuthors),
  }

  return processed
}

export function processArticleLikeEntitiesAsSummarries<
  TEntity extends SanitisedArticle | SanitisedBlog
>(
  entities: TEntity[],
  {
    validLanguageIds,
    validImages,
    processedAuthors,
  }: {
    validLanguageIds: string[]
    validImages: Image[]
    processedAuthors: ReturnType<typeof processAuthorsAsChildren>
  }
) {
  return entities.map((entity) =>
    processArticleLikeEntityAsSummary(entity, {
      processedAuthors,
      validLanguageIds,
      validImages,
    })
  )
}
