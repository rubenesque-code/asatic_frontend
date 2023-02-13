import parse, { attributesToProps, domToReact } from "html-react-parser"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import tw from "twin.macro"

import { truncateText } from "^helpers/document"
import { $link } from "^styles/global"

const HtmlStrToJSX = ({
  htmlStr,
  flattenContent,
  footnotes,
}: {
  htmlStr: string
  flattenContent?: {
    numChars: number
  }
  footnotes?: {
    validIds: string[]
    scrollToContainer: () => void
  }
}) => {
  const [flattenedTextContent, setFlattenedTextContent] = useState<
    string | null
  >(null)

  const textRef = useRef<HTMLDivElement | null>(null)

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect

  useIsomorphicLayoutEffect(() => {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const domNodeAsserted = domNode as any

            if (domNodeAsserted.type !== "tag") {
              return
            }

            if (domNodeAsserted.name === "a") {
              return (
                <a
                  {...attributesToProps(domNodeAsserted.attribs)}
                  target="_blank"
                >
                  {domToReact(domNodeAsserted.children)}
                </a>
              )
            }

            // footnotes
            if (!footnotes?.validIds.length) {
              return
            }
            if (domNodeAsserted.name !== "sup") {
              return
            }

            const id = domNodeAsserted.attribs.id
            const index = footnotes.validIds.findIndex(
              (validId) => validId === id
            )

            if (index < 0) {
              return <></>
            }

            return (
              <sup
                id={`ft-num-${id}`}
                onClick={footnotes.scrollToContainer}
                css={[$link]}
              >
                {index + 1}
              </sup>
            )
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
