import { useWindowSize } from "react-use"
import tw, { TwStyle } from "twin.macro"

import HtmlStrToJSX from "^components/HtmlStrToJSX"

const Prose_ = ({
  htmlStr,
  styles,
  validFootnoteIds,
}: {
  htmlStr: string
  styles?: TwStyle
  validFootnoteIds?: string[]
}) => {
  const windowSize = useWindowSize()

  return (
    <div
      css={[styles, windowSize.width >= 640 ? tw`prose prose-lg` : tw`prose`]}
      className="custom-prose"
      style={{
        width: "auto",
      }}
    >
      <HtmlStrToJSX htmlStr={htmlStr} validFootnoteIds={validFootnoteIds} />
    </div>
  )
}

export default Prose_
