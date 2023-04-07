import tw from "twin.macro"

import { StaticData } from "./staticData"

import BodyHeader from "./BodyHeader"
import ChildDocuments from "./ChildDocuments"
import { $CenterMaxWidth_ } from "^page-presentation"
import { BodyFontWrapper, PageWrapper_ } from "^components/my-pages/_containers"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageWrapper_ globalData={globalData} pageTitle={pageData.collection.title}>
      <BodyFontWrapper documentLanguageId={pageData.collection.languageId}>
        <BodyHeader collection={pageData.collection} />
        <$CenterMaxWidth_
          maxWidth={tw`max-w-[700px]`}
          styles={tw`mx-xxs sm:mx-sm md:mx-md`}
        >
          <div css={[tw`border-l border-r`]}>
            <ChildDocuments collection={pageData.collection} />
          </div>
        </$CenterMaxWidth_>
      </BodyFontWrapper>
    </PageWrapper_>
  )
}

export default PageContent
