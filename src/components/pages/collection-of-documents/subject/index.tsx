import { StaticData } from "./staticData"

import { $PageBody } from "^components/pages/_styles"
import DocumentHeader from "./Header"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import DocumentBody from "./Body"
import { $nonDocumentMaxWidth } from "^styles/global"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({
  globalData,
  pageData: { title, languageId, collections, customSections, recordedEvents },
}: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <div>
            <DocumentHeader
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              title={title!}
              languageId={languageId}
            />
            <DocumentBody
              childDocumentEntities={customSections}
              collections={collections}
              recordedEvents={recordedEvents}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              subjectTitle={title!}
              subjectLanguageId={languageId}
            />
          </div>
        </$CenterMaxWidth_>
      </$PageBody>
    </PageLayout_>
  )
}

export default PageContent
