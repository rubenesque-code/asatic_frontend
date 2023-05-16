import { StaticData } from "../_types"

import { Document_ } from "../_containers"
import { PageWrapper_ } from "^components/my-pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

const PageContent = ({ globalData, pageData }: StaticData) => {
  const { documentLanguage } = useDetermineDocumentLanguage(pageData.languages)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = pageData.articleLikeEntity.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!
  return (
    <PageWrapper_ globalData={globalData} pageTitle={translation.title}>
      <Document_ pageData={pageData} />
    </PageWrapper_>
  )
}

export default PageContent
