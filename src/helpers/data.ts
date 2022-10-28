export function mapLanguageIds<T extends { languageId: string }>(
  arr: T[]
): string[] {
  return arr.map((a) => a.languageId)
}
