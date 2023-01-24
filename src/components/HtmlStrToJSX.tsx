import parse from "html-react-parser"
import { useLayoutEffect, useRef, useState } from "react"
import tw from "twin.macro"
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

  // const a = flattenContent ? null : textRef.current

  useLayoutEffect(() => {
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
    <div css={[tw`hidden`]} ref={textRef}>
      {parse(htmlStr)}
    </div>
  ) : (
    <>{truncateText(flattenedTextContent, flattenContent.numChars)}</>
  )
}

export default HtmlStrToJSX
