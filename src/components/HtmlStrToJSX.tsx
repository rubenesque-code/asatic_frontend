import parse from "html-react-parser"
import { useLayoutEffect, useRef, useState } from "react"
import tw from "twin.macro"

import { truncateText } from "^helpers/document"

const HtmlStrToJSX = ({
  htmlStr,
  flattenContent,
  validFootnoteIds,
}: {
  htmlStr: string
  flattenContent?: {
    numChars: number
  }
  validFootnoteIds?: string[]
}) => {
  const [flattenedTextContent, setFlattenedTextContent] = useState<
    string | null
  >(null)

  const textRef = useRef<HTMLDivElement | null>(null)

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
    return (
      <div>
        {parse(htmlStr, {
          replace: (domNode) => {
            if (!validFootnoteIds?.length) {
              return
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const domNodeAsserted = domNode as any

            if (domNodeAsserted.type !== "tag") {
              return
            }
            if (domNodeAsserted.name !== "sup") {
              return
            }

            const id = domNodeAsserted.attribs.id
            const index = validFootnoteIds.findIndex(
              (validId) => validId === id
            )

            if (index < 0) {
              return <></>
            }

            return <sup id={`ft-num-${id}`}>{index + 1}</sup>
          },
        })}
      </div>
    )
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
