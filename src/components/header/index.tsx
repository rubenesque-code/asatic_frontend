import Link from "next/link"
import tw from "twin.macro"

import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import SideBar from "./SideBar"
import SiteLanguage from "./SiteLanguage"
import { $link, $pagePx } from "^styles/global"

const Header = () => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div
      css={[
        tw`relative flex justify-between items-center py-sm sm:py-lg md:py-xl border-b bg-white`,
        $pagePx,
      ]}
    >
      <div>
        <SideBar />
      </div>
      <div
        css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
      >
        <div css={[tw`flex flex-col items-center font-serif-primary`]}>
          <Link
            href={{ pathname: "/", query: { siteLanguageId: siteLanguage.id } }}
            passHref
          >
            <h1
              css={[tw`text-2xl sm:text-5xl tracking-wider font-bold`, $link]}
            >
              {siteTranslations.siteName[siteLanguage.id]}
            </h1>
          </Link>
          <h3 css={[tw`text-gray-600 text-sm sm:text-lg`]}>
            {siteTranslations.siteByline[siteLanguage.id]}
          </h3>
        </div>
      </div>
      <SiteLanguage />
    </div>
  )
}

export default Header
