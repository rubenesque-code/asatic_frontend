import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageWrapper_ } from "^components/pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import Summary from "./Summary"
import { $ContentSectionMaxWidthWrapper } from "^components/pages/_presentation"

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
    <div>
      <div css={[tw`border-b`]}>
        <$ContentSectionMaxWidthWrapper styles={tw`px-md sm:px-lg md:px-xl`}>
          <$SectionContent css={[tw`pt-xl pb-md`]}>
            <h1
              css={[
                tw`text-3xl capitalize text-gray-700 tracking-wide font-bold`,
              ]}
            >
              {translation.name}
            </h1>
            <Languages_
              documentLanguage={filterLanguage}
              documentLanguages={languages}
              styles={tw`pt-lg`}
            />
          </$SectionContent>
        </$ContentSectionMaxWidthWrapper>
      </div>
      <$ContentSectionMaxWidthWrapper styles={tw`p-md sm:p-lg md:p-xl`}>
        <$SectionContent>
          <div css={[tw`flex flex-col gap-lg`]}>
            {translation.documents.map((entity) => (
              <Summary
                entity={entity}
                languageId={filterLanguage.id}
                key={entity.id}
              />
            ))}
          </div>
        </$SectionContent>
      </$ContentSectionMaxWidthWrapper>
    </div>
  )
}

const $SectionContent = tw.div`mx-xxs sm:mx-sm md:mx-md`
