import tw from "twin.macro"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { LanguageFilter_, LanguageFilter_Props } from "../../_containers"

const DocumentHeader = (languageFilterProps: LanguageFilter_Props) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div css={[tw`pb-sm border-b`]}>
      <h2 css={[tw`text-center text-3xl capitalize`]}>
        {siteTranslations.articles[siteLanguage.id]}
      </h2>
      <div css={[tw`mt-lg pl-sm md:pl-md`]}>
        <LanguageFilter_ {...languageFilterProps} />
      </div>
    </div>
  )
}

export default DocumentHeader
