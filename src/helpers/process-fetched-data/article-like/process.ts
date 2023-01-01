import produce from "immer"
import { mapIds } from "^helpers/data"
import {
  SanitisedArticle,
  SanitisedBlog,
  Image,
  TextSection,
  ImageSection,
  VideoSection,
} from "^types/entities"
import { DeepRequired, MakeRequired, MyOmit } from "^types/utilities"
import { validateTranslation } from "./validate"

type ProcessedTranslationBody =
  | MakeRequired<TextSection, "text">
  | DeepRequired<ImageSection, ["image", "imageId"]>
  | MakeRequired<VideoSection, "youtubeId">

type ProcessedTranslation = MyOmit<
  SanitisedArticle["translations"][number],
  "body"
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
  }) as ProcessedTranslation[]

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

export function processArticleLikeEntityAsChild<
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
  }) as ProcessedTranslation[]

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
