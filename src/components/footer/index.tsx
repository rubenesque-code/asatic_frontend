import Link from "next/link"
import tw from "twin.macro"
import { routes } from "^constants/routes"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import { $ContentSectionMaxWidthWrapper } from "^page-presentation"
import { $link, $pagePx } from "^styles/global"

const Footer = () => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div css={[tw`border-t mt-lg sm:mt-xl md:mt-2xl`]}>
      <$ContentSectionMaxWidthWrapper styles={[$pagePx]}>
        <div css={[tw`flex items-center justify-between py-xl`]}>
          <div css={[tw`flex items-center gap-lg`]}>
            <div css={[tw`font-serif-primary`]}>
              <Link
                href={{
                  pathname: "/",
                  query: { siteLanguageId: siteLanguage.id },
                }}
                passHref
              >
                <h3
                  css={[
                    tw`text-xl font-bold border-b border-b-gray-300 pb-xs`,
                    $link,
                  ]}
                >
                  {siteTranslations.siteName[siteLanguage.id]}
                </h3>
              </Link>
              <p css={[tw`mt-xs text-gray-600`]}>
                {siteTranslations.siteByline[siteLanguage.id]}
              </p>
            </div>
          </div>
          <div
            css={[
              tw`flex flex-col items-end gap-sm sm:flex-row sm:items-baseline sm:flex-grow sm:justify-between`,
            ]}
          >
            <div css={[tw`hidden sm:block`]} />
            <div>
              <Link
                href={{
                  pathname: routes.about,
                  query: { siteLanguageId: siteLanguage.id },
                }}
                passHref
              >
                <span
                  css={[
                    tw`text-gray-600 capitalize`,
                    $link,
                    siteLanguage.id === "tamil"
                      ? tw`font-sans-primary-tamil`
                      : tw`font-sans-primary`,
                  ]}
                >
                  {siteTranslations.about_us[siteLanguage.id]}
                </span>
              </Link>
            </div>
            <div css={[tw`flex items-center`]}>
              <a css={[tw`text-gray-600`, tw`font-sans-primary`]}>
                contact@asatic.org
              </a>
            </div>
          </div>
        </div>
      </$ContentSectionMaxWidthWrapper>
    </div>
  )
}

export default Footer
