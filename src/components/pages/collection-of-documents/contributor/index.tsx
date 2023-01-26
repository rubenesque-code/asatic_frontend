import tw from "twin.macro"

import { StaticData } from "./staticData"

import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

import {
  BodyFontWrapper,
  BodyHeaderLayout_,
  PageWrapper_,
} from "^components/pages/_containers"
import Summary from "./Summary"
import {
  $ContentSectionMaxWidthWrapper,
  $ContentSectionLayout_,
} from "^components/pages/_presentation"

const AuthorsPageContent = ({ globalData, pageData }: StaticData) => {
  const { documentLanguage: filterLanguage } = useDetermineDocumentLanguage(
    pageData.languages
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = pageData.author.translations.find(
    (author) => author.languageId === filterLanguage.id
  )!

  return (
    <PageWrapper_ globalData={globalData} pageTitle={translation.name}>
      <PageBody pageData={pageData} />
    </PageWrapper_>
  )
}

export default AuthorsPageContent

const PageBody = ({
  pageData: { author, languages },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { documentLanguage: filterLanguage } =
    useDetermineDocumentLanguage(languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = author.translations.find(
    (author) => author.languageId === filterLanguage.id
  )!

  return (
    <BodyFontWrapper documentLanguageId={filterLanguage.id}>
      <BodyHeaderLayout_
        title={{ text: translation.name, align: "left" }}
        languages={{
          documentLanguage: filterLanguage,
          documentLanguages: languages,
        }}
      />
      <div css={[tw`mt-md px-sm`]}>
        <$ContentSectionLayout_>
          <div css={[tw`flex flex-col gap-lg `]}>
            {translation.documents.map((entity) => (
              <Summary
                entity={entity}
                languageId={filterLanguage.id}
                key={entity.id}
              />
            ))}
          </div>
        </$ContentSectionLayout_>
      </div>
    </BodyFontWrapper>
  )
}
