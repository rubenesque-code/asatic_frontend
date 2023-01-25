import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { mapIds } from "^helpers/data"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { EntityLink_ } from "^entity-summary/_containers"
import { $link } from "^styles/global"

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
      <div css={[tw`border-b`]}>
        <$SectionContent>
          <div>{}</div>
        </$SectionContent>
      </div>
    </div>
  )
}

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`
