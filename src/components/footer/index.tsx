import tw from "twin.macro"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import { $ContentSectionMaxWidthWrapper } from "^page-presentation"
import { $link, $pagePx } from "^styles/global"

const Footer = () => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div css={[tw`border-t-2 mt-lg sm:mt-xl md:mt-2xl`]}>
      <$ContentSectionMaxWidthWrapper styles={[$pagePx]}>
        <div css={[tw`flex items-center justify-between py-xl`]}>
          <div css={[tw`flex items-center gap-lg`]}>
            <h3 css={[tw`text-xl font-bold border-b border-b-gray-300 pb-xs`]}>
              {siteTranslations.siteName[siteLanguage.id]}
            </h3>
          </div>
          <div css={[tw`flex items-center`]}>
            <a css={[tw`font-sans-primary font-light`, $link]}>
              asatic@gmail.com
            </a>
          </div>
        </div>
      </$ContentSectionMaxWidthWrapper>
    </div>
  )
}

export default Footer
