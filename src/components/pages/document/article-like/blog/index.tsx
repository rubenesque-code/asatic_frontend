import tw from "twin.macro"

import { StaticData } from "../_types"

import { $PageBody } from "^components/pages/_styles"
import { Document_ } from "../_containers"
import { $textSectionMaxWidth } from "^styles/global"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <$PageBody>
        <$CenterMaxWidth_
          maxWidth={$textSectionMaxWidth}
          styles={tw`px-sm sm:px-md`}
        >
          <Document_ pageData={pageData} />
        </$CenterMaxWidth_>
      </$PageBody>
    </PageLayout_>
  )
}

export default PageContent
