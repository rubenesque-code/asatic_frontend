import parse from 'html-react-parser'
import { JSONContent } from '@tiptap/react'

const htmlStr =
  '<div><p>The politician tipped to become Brazil’s new environment minister has paid tribute to the murdered British journalist Dom Phillips and said Luiz Inácio Lula da Silva’s incoming government will battle to honour the memory of the rainforest martyrs killed trying to safeguard the Amazon.</p></div>'

const HtmlStrToJSX = ({ text }: { text: JSONContent }) => {
  return <>{parse(htmlStr)}</>
}

export default HtmlStrToJSX
