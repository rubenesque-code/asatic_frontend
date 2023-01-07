import { mapIds } from "^helpers/data"

import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import Header from "^components/header"
import { $PageBody } from "^components/pages/_styles"
import DocumentHeader from "./Header"
import DocumentBody from "./Body"

const PageContent = ({ header, collection }: StaticData) => {
  const { documentLanguage } = useDetermineDocumentLanguage(
    collection.languages
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  return (
    <>
      <Header {...header} documentLanguageIds={mapIds(collection.languages)} />
      <$PageBody>
        <div>
          <DocumentHeader
            translations={collection.translations}
            bannerImage={collection.bannerImage}
            documentLanguage={documentLanguage}
            documentLanguages={collection.languages}
          />
          <DocumentBody
            documentLanguage={documentLanguage}
            childDocumentEntities={collection.childDocumentEntities}
            subjectTitle={translation.title}
          />
        </div>
      </$PageBody>
    </>
  )
}

export default PageContent
