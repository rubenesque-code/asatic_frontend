import tw from "twin.macro"

import { StaticData } from "./staticData"

import DocumentHeader from "./Header"
import ChildDocuments from "./ChildDocuments"
import { $CenterMaxWidth_ } from "^page-presentation"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <>
        <div>
          <DocumentHeader collection={pageData.collection} />
          <$CenterMaxWidth_ maxWidth={tw`max-w-[700px]`}>
            <div css={[tw`border-l border-r`]}>
              <ChildDocuments collection={pageData.collection} />
            </div>
          </$CenterMaxWidth_>
        </div>
      </>
    </PageLayout_>
  )
}

export default PageContent
