export function mapIds<T extends { id: string }>(arr: T[]): string[] {
  return arr.map((a) => a.id)
}

export function mapLanguageIds<T extends { languageId: string }>(
  arr: T[]
): string[] {
  return arr.map((a) => a.languageId)
}
