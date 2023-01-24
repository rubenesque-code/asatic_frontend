import { ReactElement } from "react"
import tw from "twin.macro"

import { $SummaryContainer } from "^entity-summary/_styles/$swiper-summary"

export const $SwiperSlideContainer = ({
  children,
  index,
  rightBorder,
}: {
  children: ReactElement | ReactElement[] | (ReactElement | null)[]
  index: number
  rightBorder: boolean
}) => (
  <$SummaryContainer
    css={[index !== 0 && tw`border-l`, rightBorder && tw`border-r`]}
  >
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>{children}</div>
  </$SummaryContainer>
)
