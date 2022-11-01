import parse from 'html-react-parser'

const HtmlStrToJSX = ({ text }: { text: string }) => {
  return <>{parse(text)}</>
}

export default HtmlStrToJSX
