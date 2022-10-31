import produce from 'immer'
import { Article, Blog, ArticleLikeTranslation } from '^types/index'
import { checDocHasTextContent } from '../tiptap'

export function getArticleLikeDocumentImageIds(
  articleLikeTranslations: ArticleLikeTranslation[]
) {
  const imageIds = articleLikeTranslations
    .flatMap((t) => t.body)
    .flatMap((s) => (s.type === 'image' ? [s] : []))
    .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []))

  const unique = Array.from(new Set(imageIds).values())

  return unique
}

const checkTranslationHasText = (translation: ArticleLikeTranslation) => {
  const textSections = translation.body.flatMap((section) =>
    section.type === 'text' ? [section] : []
  )
  const firstTextSection = textSections[0]

  if (!firstTextSection?.text) {
    return false
  }

  const hasText = checDocHasTextContent(firstTextSection.text)

  return hasText
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

export function validateArticleLikeEntities<TEntity extends Article | Blog>(
  entities: TEntity[],
  validLanguageIds: string[]
) {
  // * filtering for published entities happens when fetching data
  const validated = produce(entities, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const entity = draft[i]

      for (let j = 0; j < entity.translations.length; j++) {
        const translation = entity.translations[j]
        const isValid = validateTranslation(translation, validLanguageIds)

        if (!isValid) {
          const translationIndex = entity.translations.findIndex(
            (t) => t.id === translation.id
          )
          entity.translations.splice(translationIndex, 1)
        }
      }

      // todo: this is definitely working as expected?
      if (!entity.translations.length) {
        const entityIndex = draft.findIndex((e) => e.id === entity.id)
        draft.splice(entityIndex, 1)
      }
    }
  })

  return validated
}
