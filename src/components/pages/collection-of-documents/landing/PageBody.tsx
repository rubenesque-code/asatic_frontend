/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"
import { useWindowSize } from "react-use"

import { StaticData } from "./staticData"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { LandingCustomSectionComponent } from "^types/entities"

import { ArticleLikeSummaryDefault } from "^entity-summary/article-like"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import CollectionsSection from "^entity-summary/collections"
import RecordedEventsSection from "^entity-summary/recorded-events/swiper"
import { mapLanguageIds } from "^helpers/data"

// TODO: handle no custom section components: site in progress. for each language

const PageBody = ({
  landingSections,
}: {
  landingSections: StaticData["landingSections"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const firstSectionComponentsForSiteLanguage =
    landingSections.firstSectionComponents?.filter((component) =>
      mapLanguageIds(component.entity.translations).includes(siteLanguage.id)
    ) || null
  const secondSectionComponentsForSiteLanguage =
    landingSections.secondSectionComponents?.filter((component) =>
      mapLanguageIds(component.entity.translations).includes(siteLanguage.id)
    ) || null

  const collectionsForSiteLanguage =
    landingSections.collections?.filter(
      (collection) => collection.languageId === siteLanguage.id
    ) || null

  const recordedEventsForSiteLanguage =
    landingSections.recordedEvents?.filter((recordedEvent) =>
      mapLanguageIds(recordedEvent.translations).includes(siteLanguage.id)
    ) || null

  return (
    <div css={[tw`pb-xl`]}>
      <CustomSection
        components={firstSectionComponentsForSiteLanguage}
        section={0}
      />
      <CollectionsSection collections={collectionsForSiteLanguage} />
      <RecordedEventsSection
        recordedEvents={recordedEventsForSiteLanguage}
        parentCurrentLanguageId={siteLanguage.id}
      />
      <CustomSection
        components={secondSectionComponentsForSiteLanguage}
        section={1}
      />
    </div>
  )
}

export default PageBody

const CustomSection = ({
  components,
  section,
}: {
  components: StaticData["landingSections"]["firstSectionComponents"]
  section: 0 | 1
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const windowSize =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    typeof window !== undefined ? useWindowSize() : { width: 5000 }

  if (!components?.length) {
    return null
  }

  const rightBorderArr = calcIsRightBorder(components)
  const bottomBorderArr = calcIsBottomBorder(components)

  return (
    <div css={[tw`border-b`, section === 1 && tw`mt-xl border-t`]}>
      <$SectionContent css={[tw`grid grid-cols-4`]}>
        {components.map((component, i) => {
          const useImage = windowSize.width < 1024 || component.width === 2

          return (
            <$SummaryContainer
              css={[
                tw`col-span-4`,
                i + 1 < components.length ? tw`border-b` : tw`border-b-0`,
                tw`md:col-span-2`,
                i % 2 === 0 ? tw`md:border-r` : tw`md:border-r-0`,
                (components.length % 2 === 1 && i < components.length - 1) ||
                (components.length % 2 === 0 && i < components.length - 2)
                  ? tw`md:border-b`
                  : tw`md:border-b-0`,
                component.width === 2 ? tw`lg:col-span-2` : tw`lg:col-span-1`,
                rightBorderArr[i] ? tw`lg:border-r` : tw`lg:border-r-0`,
                bottomBorderArr[i] ? tw`lg:border-b` : tw`lg:border-b-0`,
              ]}
              key={component.id}
            >
              <ArticleLikeSummaryDefault
                articleLikeEntity={component.entity}
                parentCurrentLanguageId={siteLanguage.id}
                useImage={useImage}
                isSmall={windowSize.width >= 1024 && component.width === 1}
              />
            </$SummaryContainer>
          )
        })}
      </$SectionContent>
    </div>
  )
}

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`

const calcIsRightBorder = (components: LandingCustomSectionComponent[]) => {
  const isRightBorderArr = [] as boolean[]

  const rowSpanTotalMax = 4
  let rowSpanTotal = 0

  for (let i = 0; i < components.length; i++) {
    const component = components[i]
    if (i === 0) {
      isRightBorderArr.push(true)
      rowSpanTotal += component.width
      continue
    }
    if (component.width + rowSpanTotal < rowSpanTotalMax) {
      isRightBorderArr.push(true)
      rowSpanTotal += component.width
      continue
    }
    isRightBorderArr.push(false)
    rowSpanTotal = 0
  }

  return isRightBorderArr
}

const calcIsBottomBorder = (components: LandingCustomSectionComponent[]) => {
  const isBottomBorderArr = [] as boolean[]

  const totalComponentSpan = components.reduce((acc, cv) => acc + cv.width, 0)
  const rowSpanTotalMax = 4
  let rowSpanTotal = 0

  for (let i = 0; i < components.length; i++) {
    const component = components[i]

    rowSpanTotal += component.width

    const isNotOnFirstRow =
      rowSpanTotal <=
      totalComponentSpan -
        (totalComponentSpan % rowSpanTotalMax === 0
          ? 4
          : totalComponentSpan % rowSpanTotalMax)

    isBottomBorderArr.push(isNotOnFirstRow ? true : false)
  }

  return isBottomBorderArr
}
