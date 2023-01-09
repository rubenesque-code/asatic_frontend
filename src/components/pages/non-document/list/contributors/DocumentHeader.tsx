import { ReactElement } from "react"
import tw from "twin.macro"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const DocumentHeader = ({
  languageSort,
}: {
  languageSort: ReactElement | null
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div css={[tw`pb-sm border-b`, !languageSort && tw`pb-lg`]}>
      <h2 css={[tw`text-center text-3xl capitalize`]}>
        {siteTranslations.authors[siteLanguage.id]}
      </h2>
      {languageSort ? (
        <div css={[tw`mt-lg pl-sm md:pl-md`]}>{languageSort}</div>
      ) : null}
    </div>
  )
}

export default DocumentHeader
