import produce from "immer"

export function reorderSections<TSection extends { index: number }>(
  sections: TSection[]
) {
  const ordered = produce(sections, (draft) => {
    draft.sort((a, b) => a.index - b.index)
  })

  return ordered
}

export function sortEntitiesByDate<TEntity extends { publishDate: string }>(
  entities: TEntity[]
) {
  return entities.sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })
}
