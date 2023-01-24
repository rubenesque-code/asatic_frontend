import { ReactElement } from "react"
import tw from "twin.macro"
import { ArrowRight } from "phosphor-react"

import {
  $SectionContent,
  $SectionHeaderTitle,
  $SectionHeaderContainer,
  $SectionHeaderSeeAllContainer,
  $SectionHeaderSeeAllText,
  $SectionHeaderSeeAllArrowIcon,
} from "../_styles/$swiper-section"
import { $link } from "^styles/global"
import { useSiteLanguageContext } from "^context/SiteLanguage"

export const $SwiperSectionLayout = ({
  swiper,
  title,
  seeAllText,
}: {
  title: string
  swiper: ReactElement
  seeAllText: string
}) => {
  const { siteLanguage } = useSiteLanguageContext()
  return (
    <div css={[tw`border-b`]}>
      <$SectionHeaderContainer>
        <$SectionHeaderTitle>{title}</$SectionHeaderTitle>
        <$SectionHeaderSeeAllContainer css={[$link]}>
          <$SectionHeaderSeeAllText languageId={siteLanguage.id}>
            {seeAllText}
          </$SectionHeaderSeeAllText>
          <$SectionHeaderSeeAllArrowIcon>
            <ArrowRight weight="light" />
          </$SectionHeaderSeeAllArrowIcon>
        </$SectionHeaderSeeAllContainer>
      </$SectionHeaderContainer>
      <$SectionContent>{swiper}</$SectionContent>
    </div>
  )
}
