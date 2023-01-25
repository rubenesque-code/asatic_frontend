import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { mapIds, mapLanguageIds } from "^helpers/data"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { EntityLink_ } from "^entity-summary/_containers"
import { $link } from "^styles/global"

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
    mapLanguageIds(author.translations).includes(filterLanguage.id)
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
          <div css={[tw`grid grid-cols-2 gap-lg row-gap[2em] p-xl`]}>
            {authorsForLanguage.map((author) => (
              <Author
                author={author}
                languageId={filterLanguage.id}
                key={author.id}
              />
            ))}
          </div>
        </$SectionContent>
      </div>
    </div>
  )
}

const $SectionContent = tw.div`mx-xxs sm:mx-sm md:mx-md`

const Author = ({
  author,
  languageId,
}: {
  author: StaticData["authors"]["entities"][number]
  languageId: string
}) => {
  const authorTranslation = author.translations.find(
    (authorTranslation) => authorTranslation.languageId === languageId
  )

  if (!authorTranslation) {
    return null
  }

  return (
    <EntityLink_
      documentLanguageId={languageId}
      entityId={author.id}
      routeKey="contributors"
    >
      <div css={[tw`col-span-1`, $link]}>
        <h2 css={[tw`text-xl`]}>{authorTranslation.name}</h2>
        <div css={[tw`border-b border-b-gray-100 mt-sm`]} />
      </div>
    </EntityLink_>
  )
}
