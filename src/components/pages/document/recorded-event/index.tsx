import { StaticData } from "./staticData"
import Document from "./Document"
import { PageWrapper_ } from "^components/pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { findTranslationByLanguageId } from "^helpers/data"

const PageContent = ({ globalData, pageData }: StaticData) => {
  const { documentLanguage } = useDetermineDocumentLanguage(pageData.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = findTranslationByLanguageId(
    pageData.recordedEvent.translations,
    documentLanguage.id
  )!
  return (
    <PageWrapper_ globalData={globalData} pageTitle={translation.title}>
      <Document pageData={pageData} />
    </PageWrapper_>
  )
}

export default PageContent
