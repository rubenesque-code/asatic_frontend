import { CSSInterpolation } from "@emotion/css"
import { ReactElement } from "react"
import tw from "twin.macro"

import { $ContentSectionMaxWidthWrapper } from "^components/pages/_presentation"

export const $ContentSectionLayout_ = ({
  children,
  styles,
  useMargin,
}: {
  children: ReactElement | (ReactElement | null)[]
  styles?: CSSInterpolation
  useMargin?: boolean
}) => (
  <$ContentSectionMaxWidthWrapper
    styles={[styles, useMargin && tw`mx-xxs sm:mx-sm md:mx-md`]}
  >
    <div>{children}</div>
  </$ContentSectionMaxWidthWrapper>
)
