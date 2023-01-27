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
        tw`relative flex justify-between items-center pt-md pb-md border-b`,
        $pagePx,
      ]}
    >
      <div>
        <SideBar />
      </div>
      <div
        css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
      >
        <Link
          href={{ pathname: "/", query: { siteLanguageId: siteLanguage.id } }}
          passHref
        >
          <div css={[tw`text-2xl font-bold`, $link]}>
            {siteTranslations.siteName[siteLanguage.id]}
          </div>
        </Link>
      </div>
      <SiteLanguage />
    </div>
  )
}

export default Header
