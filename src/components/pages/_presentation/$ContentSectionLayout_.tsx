import { ReactElement } from "react"
import tw, { TwStyle } from "twin.macro"

import { $ContentSectionMaxWidthWrapper } from "^components/pages/_presentation"

export const $ContentSectionLayout_ = ({
  children,
  styles,
}: {
  children: ReactElement | (ReactElement | null)[]
  styles?: TwStyle
}) => (
  <$ContentSectionMaxWidthWrapper styles={styles}>
    <div css={[tw`mx-xxs sm:mx-sm md:mx-md`]}>{children}</div>
  </$ContentSectionMaxWidthWrapper>
)
