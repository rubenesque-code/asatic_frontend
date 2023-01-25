import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import Summary from "./Summary"

const AuthorsPageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <PageBody pageData={pageData} />
    </PageLayout_>
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
        <$SectionContent css={[tw`px-xl pt-xl pb-md border-r-0 border-l-0`]}>
          <h1
            css={[
              tw`text-3xl capitalize text-gray-700 tracking-wide font-bold`,
            ]}
          >
            {translation.name}
          </h1>
          <div css={[tw`pt-lg`]}>
            <Languages_
              documentLanguage={filterLanguage}
              documentLanguages={languages}
            />
          </div>
        </$SectionContent>
      </div>
      <div>
        <$SectionContent>
          <div css={[tw`p-xl flex flex-col gap-lg`]}>
            {translation.documents.map((entity) => (
              <Summary
                entity={entity}
                languageId={filterLanguage.id}
                key={entity.id}
              />
            ))}
          </div>
        </$SectionContent>
      </div>
    </div>
  )
}

const $SectionContent = tw.div`mx-xxs sm:mx-sm md:mx-md`
