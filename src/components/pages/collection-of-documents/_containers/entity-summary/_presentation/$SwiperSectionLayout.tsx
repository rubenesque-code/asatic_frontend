import { ReactElement } from "react"
import tw from "twin.macro"

import { $SectionContent, $SectionHeader } from "../_styles/$swiper-section"

export const $SwiperSectionLayout = ({
  swiper,
  title,
}: {
  title: string
  swiper: ReactElement
}) => {
  return (
    <div css={[tw`border-b`]}>
      <$SectionHeader>{title}</$SectionHeader>
      <$SectionContent>{swiper}</$SectionContent>
    </div>
  )
}
