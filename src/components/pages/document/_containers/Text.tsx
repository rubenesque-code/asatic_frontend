import { generateHTML, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import TipTapLink from '@tiptap/extension-link'
import { useMemo } from 'react'
import parse from 'html-react-parser'

export const Text_ = ({ text }: { text: JSONContent }) => {
  const htmlStr = useMemo(() => {
    return generateHTML(text, [StarterKit, Typography, TipTapLink])
  }, [text])

  return parse(htmlStr)
}
