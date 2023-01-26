import { ReactElement } from "react"
import tw from "twin.macro"

import { $ContentSectionMaxWidthWrapper } from "^components/pages/_presentation"

export const $ContentSectionLayout_ = ({
  children,
}: {
  children: ReactElement | (ReactElement | null)[]
}) => (
  <$ContentSectionMaxWidthWrapper>
    <div css={[tw`mx-xxs sm:mx-sm md:mx-md`]}>{children}</div>
  </$ContentSectionMaxWidthWrapper>
)
