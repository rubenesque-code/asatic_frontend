import { CSSInterpolation } from "@emotion/css"
import { ReactElement } from "react"
import tw, { TwStyle } from "twin.macro"

export const $CenterMaxWidth_ = ({
  children,
  maxWidth,
  styles,
}: {
  children: ReactElement
  maxWidth: TwStyle
  styles?: CSSInterpolation
}) => (
  <div css={[tw`flex justify-center`]}>
    <div css={[tw`w-full box-content`, maxWidth, styles]}>{children}</div>
  </div>
)

export const $ContentSectionMaxWidthWrapper = ({
  children,
  styles,
}: {
  children: ReactElement
  styles?: CSSInterpolation
}) => (
  <$CenterMaxWidth_ maxWidth={tw`max-w-[1300px]`} styles={styles}>
    {children}
  </$CenterMaxWidth_>
)
