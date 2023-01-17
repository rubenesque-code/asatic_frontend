/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"

import { StaticData } from "./staticData"

import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { ArticleLikeSummaryDefault } from "../_containers/entity-summary/article-like"
import { useSiteLanguageContext } from "^context/SiteLanguage"

// TODO: handle no custom section components: site in progress..
// took into account summaryimage.useimage when processing article/blogs?

const PageBody = ({
  landingSections,
}: {
  landingSections: StaticData["landingSections"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  if (!landingSections.firstSectionComponents?.length) {
    return <div>in consruction...</div>
  }

  return (
    <div css={[tw`pb-xl`]}>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`grid grid-cols-4`]}>
          {landingSections.firstSectionComponents.map((component) => {
            const numRows = Math.floor(
              landingSections.firstSectionComponents!.reduce(
                (acc, cv) => acc + cv.width,
                0
              ) / 4
            )

            // const rightBorder =
            return (
              <$SummaryContainer
                css={[component.width === 2 ? tw`col-span-2` : tw`col-span-1`]}
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

export const $SectionContent = tw.div`pt-md border-l border-r mx-xxs sm:mx-sm md:mx-md`
