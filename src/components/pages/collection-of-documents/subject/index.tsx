import tw from "twin.macro"
import { useWindowSize } from "react-use"

import { StaticData } from "./staticData"

import {
  BodyHeaderLayout_,
  BodyFontWrapper,
  PageWrapper_,
} from "^page-container"
import { $ContentSectionLayout_ } from "^page-presentation"
import { $SummaryContainer } from "^entity-summary/_styles/$summary"
import { ArticleLikeSummaryDefault } from "^entity-summary/article-like"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"
import Collections from "../_containers/entity-summary/collections"
import RecordedEvents from "../_containers/entity-summary/recorded-events/swiper"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageWrapper_ globalData={globalData} pageTitle={pageData.subject.title}>
      <PageBody pageData={pageData} />
    </PageWrapper_>
  )
}

export default PageContent

const PageBody = ({
  pageData: { collections, customSections, recordedEvents, subject },
}: {
  pageData: StaticData["pageData"]
}) => {
  const windowSize = useWindowSize()

  return (
    <BodyFontWrapper documentLanguageId={subject.languageId}>
      <BodyHeaderLayout_
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title={subject.title!}
        useMargin
      />
      <div css={[tw`border-b`]}>
        <$ContentSectionLayout_ useMargin>
          <div css={[tw`border-l border-r grid grid-cols-12 lg:grid-rows-2`]}>
            {customSections.first.map((entity, i) => (
              <$SummaryContainer
                css={[
                  tw`col-span-12`,
                  i === 0 && tw`lg:row-span-2 lg:col-span-6 lg:border-r`,
                  i !== 0 && tw`lg:min-h-[370px] md:col-span-6 lg:col-span-3`,
                  (i === 1 || i === 3) && tw`md:border-r`,
                  i === 4 ? tw`border-b-0` : tw`border-b`,
                  i === 3 || i === 4 ? tw`md:border-b-0` : tw`md:border-b`,
                  i === 1 || i === 2 ? tw`lg:border-b` : tw`lg:border-b-0`,
                ]}
                key={entity.id}
              >
                <ArticleLikeSummaryDefault
                  articleLikeEntity={entity as ArticleLikeEntityAsSummary}
                  parentCurrentLanguageId={subject.languageId}
                  useImage={i === 0}
                  isSmall={windowSize.width >= 1024 && i !== 0}
                  isDouble={i === 0 && windowSize.width >= 1024}
                />
              </$SummaryContainer>
            ))}
          </div>
        </$ContentSectionLayout_>
      </div>
      <Collections
        collections={collections}
        parentCurrentLanguageId={subject.languageId}
      />
      <RecordedEvents
        recordedEvents={recordedEvents}
        parentCurrentLanguageId={subject.languageId}
      />
      {customSections.second.length ? (
        <div css={[tw`border-b border-t mt-xl`]}>
          <$ContentSectionLayout_ useMargin>
            <div css={[tw`border-l border-r grid grid-cols-12`]}>
              {customSections.second.map((entity, i) => (
                <$SummaryContainer
                  css={[
                    tw`col-span-12 md:col-span-6 lg:col-span-4`,
                    i !== customSections.second.length - 1
                      ? tw`border-b`
                      : tw`border-b-0`,
                    windowSize.width >= 768 &&
                    customSections.second.length % 2 === 0
                      ? i !== customSections.second.length - 1 &&
                        i !== customSections.second.length - 2
                        ? tw`md:border-b`
                        : tw`md:border-b-0`
                      : i !== customSections.second.length - 1
                      ? tw`md:border-b`
                      : tw`md:border-b-0`,
                    windowSize.width >= 1024 &&
                    customSections.second.length % 3 === 0
                      ? i !== customSections.second.length - 1 &&
                        i !== customSections.second.length - 2 &&
                        i !== customSections.second.length - 3
                        ? tw`lg:border-b`
                        : tw`lg:border-b-0`
                      : customSections.second.length % 3 === 2
                      ? i !== customSections.second.length - 1 &&
                        i !== customSections.second.length - 2
                        ? tw`lg:border-b`
                        : tw`lg:border-b-0`
                      : i !== customSections.second.length - 1
                      ? tw`lg:border-b`
                      : tw`lg:border-b-0`,
                    tw`border-r-0`,
                    i % 2 === 0 ? tw`md:border-r` : tw`md:border-r-0`,
                    (i + 1) % 3 !== 0 ? tw`lg:border-r` : tw`lg:border-r-0`,
                  ]}
                  key={entity.id}
                >
                  <ArticleLikeSummaryDefault
                    articleLikeEntity={entity as ArticleLikeEntityAsSummary}
                    parentCurrentLanguageId={subject.languageId}
                    useImage={false}
                    isSmall={false}
                  />
                </$SummaryContainer>
              ))}
            </div>
          </$ContentSectionLayout_>
        </div>
      ) : null}
    </BodyFontWrapper>
  )
}
