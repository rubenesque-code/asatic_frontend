import tw from "twin.macro"

import { StaticData } from "./staticData"

import BodyHeader from "./BodyHeader"
import ChildDocuments from "./ChildDocuments"
import { $CenterMaxWidth_ } from "^page-presentation"
import { PageWrapper_ } from "^components/pages/_containers"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageWrapper_ globalData={globalData} pageTitle={pageData.collection.title}>
      <>
        <div>
          <BodyHeader collection={pageData.collection} />
          <$CenterMaxWidth_ maxWidth={tw`max-w-[700px]`}>
            <div css={[tw`border-l border-r`]}>
              <ChildDocuments collection={pageData.collection} />
            </div>
          </$CenterMaxWidth_>
        </div>
      </>
    </PageWrapper_>
  )
}

export default PageContent
