import { useWindowSize } from "react-use"
import tw, { TwStyle } from "twin.macro"

import HtmlStrToJSX from "^components/HtmlStrToJSX"

const Prose_ = ({
  htmlStr,
  styles,
  footnotes,
}: {
  htmlStr: string
  styles?: TwStyle
  footnotes?: {
    validIds: string[]
    scrollToContainer: () => void
  }
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
      <HtmlStrToJSX htmlStr={htmlStr} footnotes={footnotes} />
    </div>
  )
}

export default Prose_
