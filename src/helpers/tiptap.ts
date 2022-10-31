import { JSONContent } from '@tiptap/core'

export const checDocHasTextContent = (doc: JSONContent) => {
  const hasText = doc?.content
    ?.find((node) => node.type === 'paragraph')
    ?.content?.find((node) => node.type === 'text')?.text?.length

  return hasText
}
