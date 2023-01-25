import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { mapIds, mapLanguageIds } from "^helpers/data"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"

const AuthorsPageContent = ({
  authors,
  header,
  isMultipleAuthors,
}: StaticData) => {
  return (
    <PageLayout_
      staticData={{
        isMultipleAuthors,
        subjects: header.subjects,
        documentLanguageIds: mapIds(authors.languages),
      }}
    >
      <PageBody authors={authors} />
    </PageLayout_>
  )
}

export default AuthorsPageContent

const PageBody = ({ authors }: { authors: StaticData["authors"] }) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } = useDetermineDocumentLanguage(
    authors.languages
  )

  const authorsForLanguage = authors.entities.filter((author) =>
    mapLanguageIds(author).includes(filterLanguage.id)
  )

  return (
    <div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`px-sm pt-xl pb-md border-r-0 border-l-0`]}>
          <h1 css={[tw`text-3xl capitalize text-gray-700 text-center`]}>
            {siteTranslations.authors[siteLanguage.id]}
          </h1>
          <div css={[tw`pt-sm`]}>
            <Languages_
              documentLanguage={filterLanguage}
              documentLanguages={authors.languages}
            />
          </div>
        </$SectionContent>
      </div>
      <div css={[tw`border-b`]}>
        <$SectionContent>
          {authorsForLanguage.map((author) => (
            <Author
              author={author}
              languageId={filterLanguage.id}
              key={author.id}
            />
          ))}
        </$SectionContent>
      </div>
    </div>
  )
}

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`

const Author = ({
  author,
  languageId,
}: {
  author: StaticData["authors"]["entities"][number]
  languageId: string
}) => {
  const authorTranslation = author.find(
    (authorTranslation) => authorTranslation.languageId === languageId
  )

  if (!authorTranslation) {
    return null
  }

  return (
    <div>
      <h2>{authorTranslation.name}</h2>
    </div>
  )
}
