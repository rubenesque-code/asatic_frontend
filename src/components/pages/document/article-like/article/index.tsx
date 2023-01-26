import tw from "twin.macro"

import { StaticData } from "../_types"

import { $PageBody } from "^components/pages/_styles"
import { Document_ } from "../_containers"
import { $textSectionMaxWidth } from "^styles/global"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { PageWrapper_ } from "^components/pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

const PageContent = ({ globalData, pageData }: StaticData) => {
  const { documentLanguage } = useDetermineDocumentLanguage(pageData.languages)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = pageData.articleLikeEntity.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <PageWrapper_ globalData={globalData} pageTitle={translation.title}>
      <$PageBody>
        <$CenterMaxWidth_
          maxWidth={$textSectionMaxWidth}
          styles={tw`px-sm sm:px-md`}
        >
          <Document_ pageData={pageData} />
        </$CenterMaxWidth_>
      </$PageBody>
    </PageWrapper_>
  )
}

export default PageContent
