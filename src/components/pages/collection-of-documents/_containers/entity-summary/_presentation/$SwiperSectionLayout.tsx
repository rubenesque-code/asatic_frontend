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
import { useRouter } from "next/router"
import Link from "next/link"
import { routes } from "^constants/routes"

export const $SwiperSectionLayout = ({
  swiper,
  title,
  seeAllText,
  routeKey,
}: {
  title: string
  swiper: ReactElement
  seeAllText?: string
  routeKey: Extract<keyof typeof routes, "collections" | "recordedEvents">
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const router = useRouter()
  const pathname = routes[routeKey]

  return (
    <div css={[tw`border-b`]}>
      <$SectionHeaderContainer>
        <$SectionHeaderTitle>{title}</$SectionHeaderTitle>
        {seeAllText ? (
          <Link href={{ pathname, query: router.query }}>
            <$SectionHeaderSeeAllContainer css={[$link]}>
              <$SectionHeaderSeeAllText languageId={siteLanguage.id}>
                {seeAllText}
              </$SectionHeaderSeeAllText>
              <$SectionHeaderSeeAllArrowIcon>
                <ArrowRight weight="light" />
              </$SectionHeaderSeeAllArrowIcon>
            </$SectionHeaderSeeAllContainer>
          </Link>
        ) : null}
      </$SectionHeaderContainer>
      <$SectionContent>{swiper}</$SectionContent>
    </div>
  )
}
