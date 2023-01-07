import { mapIds } from "^helpers/data"

import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import Header from "^components/header"
import { $PageBody } from "^components/pages/_styles"
import DocumentHeader from "./Header"
import ChildDocuments from "./ChildDocuments"
import { $CenterMaxWidth_ } from "^page-presentation"
import tw from "twin.macro"

const PageContent = ({ header, collection }: StaticData) => {
  const { documentLanguage } = useDetermineDocumentLanguage(
    collection.languages
  )

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
          <$CenterMaxWidth_ maxWidth={tw`max-w-[700px]`}>
            <div css={[tw`border-l border-r`]}>
              <ChildDocuments
                documentLanguage={documentLanguage}
                childDocumentEntities={collection.childDocumentEntities}
              />
            </div>
          </$CenterMaxWidth_>
        </div>
      </$PageBody>
    </>
  )
}

export default PageContent
