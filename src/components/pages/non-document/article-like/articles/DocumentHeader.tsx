import tw from "twin.macro"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { LanguageSort_, LanguageSort_Props } from "../../_containers"

const DocumentHeader = (languageFilterProps: LanguageSort_Props) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div css={[tw`pb-sm border-b`]}>
      <h2 css={[tw`text-center text-3xl capitalize`]}>
        {siteTranslations.articles[siteLanguage.id]}
      </h2>
      <div css={[tw`mt-lg pl-sm md:pl-md`]}>
        <LanguageSort_ {...languageFilterProps} />
      </div>
    </div>
  )
}

export default DocumentHeader
