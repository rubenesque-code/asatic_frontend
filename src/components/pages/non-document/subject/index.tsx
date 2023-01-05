import { mapIds } from "^helpers/data"

import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import Header from "^components/header"
import { $PageBody } from "^components/pages/_styles"
import DocumentHeader from "./Header"
import { $DocumentContainer_ } from "./_presentation"
import DocumentBody from "./Body"

const PageContent = ({ header, subject }: StaticData) => {
  const { documentLanguage } = useDetermineDocumentLanguage(subject.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = subject.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <>
      <Header {...header} documentLanguageIds={mapIds(subject.languages)} />
      <$PageBody>
        <$DocumentContainer_>
          <DocumentHeader
            title={translation.title}
            documentLanguage={documentLanguage}
            documentLanguages={subject.languages}
          />
          <DocumentBody
            documentLanguage={documentLanguage}
            childDocumentEntities={subject.childDocumentEntities}
            collections={subject.collections}
            subjectTitle={translation.title}
          />
        </$DocumentContainer_>
      </$PageBody>
    </>
  )
}

export default PageContent
