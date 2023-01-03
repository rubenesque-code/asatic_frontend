import parse from "html-react-parser"
import { useEffect, useRef, useState } from "react"

const HtmlStrToJSX = ({
  text,
  flattenContent = false,
}: {
  text: string
  flattenContent?: boolean
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
    return <div>{parse(text)}</div>
  }

  return !flattenedTextContent ? (
    <div ref={textRef}>{parse(text)}</div>
  ) : (
    <p>{flattenedTextContent}</p>
  )
}

export default HtmlStrToJSX
