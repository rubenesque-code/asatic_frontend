import Link from "next/link"
import tw from "twin.macro"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { $link } from "^styles/global"

import SideBar, { SideBarProps } from "./SideBar"
import SiteLanguage, { SiteLanguageProps } from "./SiteLanguage"

export type HeaderProps = SideBarProps & SiteLanguageProps

const Header = ({ subjects, documentLanguageIds }: HeaderProps) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div
      css={[
        tw`relative flex justify-between items-center pt-md px-md pb-md border-b`,
      ]}
    >
      <div>
        <SideBar subjects={subjects} />
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
      <SiteLanguage documentLanguageIds={documentLanguageIds} />
    </div>
  )
}

export default Header
