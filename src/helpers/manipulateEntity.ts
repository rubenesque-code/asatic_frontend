import produce from "immer"

export function reorderSections<TSection extends { index: number }>(
  sections: TSection[]
) {
  const ordered = produce(sections, (draft) => {
    draft.sort((a, b) => a.index - b.index)
  })

  return ordered
}
