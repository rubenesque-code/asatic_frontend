import { ReactElement } from "react"
import tw from "twin.macro"

import { $SummaryContainer } from "^entity-summary/_styles/$swiper-summary"

export const $SwiperSlideContainer = ({
  children,
  index,
}: {
  children: ReactElement | ReactElement[] | (ReactElement | null)[]
  index: number
}) => (
  <$SummaryContainer css={[index !== 0 && tw`border-l`]}>
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>{children}</div>
  </$SummaryContainer>
)
