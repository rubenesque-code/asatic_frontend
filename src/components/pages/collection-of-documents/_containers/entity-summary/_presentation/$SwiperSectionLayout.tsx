import { ReactElement } from "react"
import tw from "twin.macro"
import { ArrowRight } from "phosphor-react"
import { useRouter } from "next/router"
import Link from "next/link"

import { routes } from "^constants/routes"

import {
  $SectionContent,
  $SectionHeaderTitle,
  $SectionHeaderContainer,
  $SectionHeaderSeeAllContainer,
  $SectionHeaderSeeAllText,
  $SectionHeaderSeeAllArrowIcon,
} from "../_styles/$swiper-section"
import { $link } from "^styles/global"
import { SiteLanguageId } from "^constants/languages"

export const $SwiperSectionLayout = ({
  swiper,
  title,
  seeAllText,
  routeKey,
  parentCurrentLanguageId,
}: {
  title: string
  swiper: ReactElement
  seeAllText?: string
  routeKey: Extract<keyof typeof routes, "collections" | "recordedEvents">
  parentCurrentLanguageId: string
}) => {
  const router = useRouter()
  const pathname = routes[routeKey]

  const languageId: SiteLanguageId =
    parentCurrentLanguageId === "tamil" ? "tamil" : "english"

  return (
    <div css={[tw`border-b`]}>
      <$SectionHeaderContainer>
        <$SectionHeaderTitle>{title}</$SectionHeaderTitle>
        {seeAllText ? (
          <Link href={{ pathname, query: router.query }}>
            <$SectionHeaderSeeAllContainer css={[$link]}>
              <$SectionHeaderSeeAllText languageId={languageId}>
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
