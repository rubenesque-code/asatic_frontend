import tw from "twin.macro"

import { StaticData } from "./staticData"

import {
  BodyFontWrapper,
  BodyHeaderLayout_,
  PageWrapper_,
} from "^components/pages/_containers"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { mapLanguageIds } from "^helpers/data"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { EntityLink_ } from "^entity-summary/_containers"
import { $link, $pagePx } from "^styles/global"
import { $ContentSectionLayout_ } from "^page-presentation"

const AuthorsPageContent = ({ globalData, pageData }: StaticData) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <PageWrapper_
      globalData={globalData}
      pageTitle={siteTranslations.authors[siteLanguage.id]}
    >
      <PageBody pageData={pageData} />
    </PageWrapper_>
  )
}

export default AuthorsPageContent

const PageBody = ({
  pageData: { authors, languages },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } =
    useDetermineDocumentLanguage(languages)

  const authorsForLanguage = authors.filter((author) =>
    mapLanguageIds(author.translations).includes(filterLanguage.id)
  )

  return (
    <BodyFontWrapper documentLanguageId={filterLanguage.id}>
      <BodyHeaderLayout_
        title={siteTranslations.authors[siteLanguage.id]}
        languages={{
          documentLanguage: filterLanguage,
          documentLanguages: languages,
        }}
        styles={[$pagePx]}
      />
      <$ContentSectionLayout_>
        <div
          css={[tw`grid grid-cols-1 md:grid-cols-2 gap-lg row-gap[2em] p-xl`]}
        >
          {authorsForLanguage.map((author) => (
            <Author
              author={author}
              languageId={filterLanguage.id}
              key={author.id}
            />
          ))}
        </div>
      </$ContentSectionLayout_>
    </BodyFontWrapper>
  )
}

const Author = ({
  author,
  languageId,
}: {
  author: StaticData["pageData"]["authors"][number]
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
