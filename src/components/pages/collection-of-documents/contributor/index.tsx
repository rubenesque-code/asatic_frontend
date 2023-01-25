import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { mapIds } from "^helpers/data"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import Summary from "./Summary"

const AuthorsPageContent = ({
  author,
  header,
  isMultipleAuthors,
}: StaticData) => {
  return (
    <PageLayout_
      staticData={{
        isMultipleAuthors,
        subjects: header.subjects,
        documentLanguageIds: mapIds(author.languages),
      }}
    >
      <PageBody author={author} />
    </PageLayout_>
  )
}

export default AuthorsPageContent

const PageBody = ({ author }: { author: StaticData["author"] }) => {
  const { documentLanguage: filterLanguage } = useDetermineDocumentLanguage(
    author.languages
  )

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
              documentLanguages={author.languages}
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
