/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"

import { StaticData } from "./staticData"

import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { ArticleLikeSummaryDefault } from "../_containers/entity-summary/article-like"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { LandingCustomSectionComponent } from "^types/entities"

// TODO: handle no custom section components: site in progress..
// took into account summaryimage.useimage when processing article/blogs?
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

const PageBody = ({
  landingSections,
}: {
  landingSections: StaticData["landingSections"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  if (!landingSections.firstSectionComponents?.length) {
    return <div>in construction...</div>
  }

  const firstSectionRightBorder = calcIsRightBorder(
    landingSections.firstSectionComponents
  )
  const firstSectionBottomBorder = calcIsBottomBorder(
    landingSections.firstSectionComponents
  )

  return (
    <div css={[tw`pb-xl`]}>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`grid grid-cols-4`]}>
          {landingSections.firstSectionComponents.map((component, i) => {
            return (
              <$SummaryContainer
                css={[
                  component.width === 2 ? tw`lg:col-span-2` : tw`lg:col-span-1`,
                  firstSectionRightBorder[i] && tw`lg:border-r`,
                  firstSectionBottomBorder[i] && tw`lg:border-b`,
                  tw`md:col-span-2`,
                  i % 2 === 0 && tw`md:border-r`,
                  ((landingSections.firstSectionComponents!.length % 2 === 1 &&
                    i < landingSections.firstSectionComponents!.length - 1) ||
                    (landingSections.firstSectionComponents!.length % 2 === 0 &&
                      i <
                        landingSections.firstSectionComponents!.length - 2)) &&
                    tw`md:border-b`,
                  tw`col-span-4`,
                  i + 1 < landingSections.firstSectionComponents!.length &&
                    tw`border-b`,
                ]}
                key={component.id}
              >
                <ArticleLikeSummaryDefault
                  articleLikeEntity={component.entity}
                  parentCurrentLanguageId={siteLanguage.id}
                  useImage={true}
                />
              </$SummaryContainer>
            )
          })}
        </$SectionContent>
      </div>
    </div>
  )
}

export default PageBody

export const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`
