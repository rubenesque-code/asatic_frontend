import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import { $ContentContainer_ } from "^page-presentation"
import { Languages_ } from "^components/pages/_containers"
import Header from "^components/header"
import ContributorHeader from "./body/Header"
import ContributorBody from "./body/Body"

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
      <$ContentContainer_>
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
        <ContributorBody />
        {/* <Body body={translation.body} images={childEntities.images} /> */}
      </$ContentContainer_>
    </div>
  )
}

export default PageContent
