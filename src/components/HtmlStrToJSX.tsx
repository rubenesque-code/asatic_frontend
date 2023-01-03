import parse from "html-react-parser"
import { useEffect, useRef, useState } from "react"
import { truncateText } from "^helpers/document"

const HtmlStrToJSX = ({
  htmlStr,
  flattenContent,
}: {
  htmlStr: string
  flattenContent?: {
    numChars: number
  }
}) => {
  const [flattenedTextContent, setFlattenedTextContent] = useState<
    string | null
  >(null)

  const textRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!flattenContent) {
      return
    }
    const node = textRef.current
    if (!node) {
      return
    }
    const textContent = node.innerText
    setFlattenedTextContent(textContent)
  }, [textRef, flattenContent])

  if (!flattenContent) {
    return <div>{parse(htmlStr)}</div>
  }

  return !flattenedTextContent ? (
    <div ref={textRef}>{parse(htmlStr)}</div>
  ) : (
    <p>{truncateText(flattenedTextContent, flattenContent.numChars)}</p>
  )
}

export default HtmlStrToJSX
