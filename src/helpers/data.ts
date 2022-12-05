export function mapIds<T extends { id: string }>(arr: T[]): string[] {
  return arr.map((a) => a.id)
}

export function mapLanguageIds<T extends { languageId: string }>(
  arr: T[]
): string[] {
  return arr.map((a) => a.languageId)
}

export function checkObjectHasField<T extends Record<string, unknown>>(obj: T) {
  const hasAKey = Object.keys(obj).length

  return Boolean(hasAKey)
}

export function findTranslation<TTranslation extends { languageId: string }>(
  translations: TTranslation[],
  languageId: string
) {
  return translations.find(
    (translation) => translation.languageId === languageId
  )
}
