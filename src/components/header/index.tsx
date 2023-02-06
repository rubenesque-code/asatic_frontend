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
        tw`relative flex justify-between items-center py-xl border-b`,
        $pagePx,
      ]}
    >
      <div>
        <SideBar />
      </div>
      <div
        css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
      >
        <div css={[tw`flex flex-col items-center`]}>
          <Link
            href={{ pathname: "/", query: { siteLanguageId: siteLanguage.id } }}
            passHref
          >
            <h1 css={[tw`text-5xl tracking-wider font-bold`, $link]}>
              {siteTranslations.siteName[siteLanguage.id]}
            </h1>
          </Link>
          <h3 css={[tw`text-gray-600 text-lg`]}>
            {siteTranslations.siteByline[siteLanguage.id]}
          </h3>
        </div>
      </div>
      <SiteLanguage />
    </div>
  )
}

export default Header

/* const Header = () => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div>
      <div
        css={[
          tw`relative flex justify-between items-baseline gap-md pt-md pb-md border-b`,
          $pagePx,
        ]}
      >
        <div css={[tw`flex flex-col`]}>
          <Link
            href={{ pathname: "/", query: { siteLanguageId: siteLanguage.id } }}
            passHref
          >
            <h1 css={[tw`text-4xl tracking-wider font-bold`, $link]}>
              {siteTranslations.siteName[siteLanguage.id]}
            </h1>
          </Link>
          <h3 css={[tw`text-gray-700 text-lg`]}>
            {siteTranslations.siteByline[siteLanguage.id]}
          </h3>
        </div>
        <div
          css={[
            tw`flex-grow flex items-center justify-end gap-sm mt-auto border uppercase font-serif-secondary`,
          ]}
        >
          <p>Articles</p>
          <p>Blogs</p>
        </div>
        <div css={[tw`mt-auto`]}>
          <SiteLanguage />
        </div>
      </div>
    </div>
  )
} */
