import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { $BodyContainer_ } from "^page-presentation"
import { Languages_ } from "^page-container"
import Header from "^components/header"
import ContributorHeader from "./body/Header"

const PageContent = ({ author, childEntities, header }: StaticData) => {
  const { documentLanguage, setDocumentLanguage } =
    useDetermineDocumentLanguage(childEntities.languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = author.translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <div>
      <Header {...header} />
      <$BodyContainer_>
        <ContributorHeader
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          contributor={{ name: translation.name! }}
          languages={
            <Languages_
              documentLanguage={documentLanguage}
              documentLanguages={childEntities.languages}
              setDocumentLanguage={setDocumentLanguage}
            />
          }
        />
        {/* <Body body={translation.body} images={childEntities.images} /> */}
      </$BodyContainer_>
    </div>
  )
}

export default PageContent
