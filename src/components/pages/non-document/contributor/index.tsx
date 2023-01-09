import { mapIds } from "^helpers/data"

import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import Header from "^components/header"
import { $PageBody } from "^components/pages/_styles"
import DocumentHeader from "./Header"
import ChildDocuments from "./ChildDocuments"
import { $CenterMaxWidth_ } from "^page-presentation"
import tw from "twin.macro"

const PageContent = ({ header, author }: StaticData) => {
  const { documentLanguage } = useDetermineDocumentLanguage(author.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = author.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <>
      <Header {...header} documentLanguageIds={mapIds(author.languages)} />
      <$PageBody>
        <div>
          <DocumentHeader
            title={translation.name}
            documentLanguage={documentLanguage}
            documentLanguages={author.languages}
          />
          <$CenterMaxWidth_ maxWidth={tw`max-w-[700px]`}>
            <div css={[tw`border-l border-r`]}>
              <ChildDocuments
                documentLanguage={documentLanguage}
                childDocumentEntities={[
                  ...author.articles,
                  ...author.blogs,
                  ...author.recordedEvents,
                ]}
              />
            </div>
          </$CenterMaxWidth_>
        </div>
      </$PageBody>
    </>
  )
}

export default PageContent
