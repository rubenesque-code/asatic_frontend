import tw from "twin.macro"

import { StaticData } from "./staticData"

import DocumentHeader from "./Header"
import ChildDocuments from "./ChildDocuments"
import { $CenterMaxWidth_ } from "^page-presentation"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({ header, collection, isMultipleAuthors }: StaticData) => {
  return (
    <PageLayout_ staticData={{ isMultipleAuthors, subjects: header.subjects }}>
      <>
        <div>
          <DocumentHeader collection={collection} />
          <$CenterMaxWidth_ maxWidth={tw`max-w-[700px]`}>
            <div css={[tw`border-l border-r`]}>
              <ChildDocuments collection={collection} />
            </div>
          </$CenterMaxWidth_>
        </div>
      </>
    </PageLayout_>
  )
}

export default PageContent
