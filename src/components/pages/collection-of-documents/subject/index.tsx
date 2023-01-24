import { StaticData } from "./staticData"

import { $PageBody } from "^components/pages/_styles"
import DocumentHeader from "./Header"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import DocumentBody from "./Body"
import { $nonDocumentMaxWidth } from "^styles/global"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({ header, subject, isMultipleAuthors }: StaticData) => {
  return (
    <PageLayout_ staticData={{ isMultipleAuthors, subjects: header.subjects }}>
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <div>
            <DocumentHeader
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              title={subject.title!}
              languageId={subject.languageId}
            />
            <DocumentBody
              childDocumentEntities={subject.childDocumentEntities}
              collections={subject.collections}
              recordedEvents={subject.recordedEvents}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              subjectTitle={subject.title!}
              subjectLanguageId={subject.languageId}
            />
          </div>
        </$CenterMaxWidth_>
      </$PageBody>
    </PageLayout_>
  )
}

export default PageContent
