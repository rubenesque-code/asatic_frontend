import Link from "next/link"
import tw from "twin.macro"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { $link } from "^styles/global"

import SideBar, { SideBarProps } from "./SideBar"
import SiteLanguage, { SiteLanguageProps } from "./SiteLanguage"

export type HeaderProps = SideBarProps & SiteLanguageProps

const Header = ({ subjects, documentLanguageIds }: HeaderProps) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div
      css={[tw`flex justify-between items-center pt-md px-md pb-md border-b`]}
    >
      <div>
        <SideBar subjects={subjects} />
      </div>
      <Link
        href={{ pathname: "/", query: { siteLanguageId: siteLanguage.id } }}
        passHref
      >
        <div css={[tw`text-2xl font-bold`, $link]}>Asatic</div>
      </Link>
      <SiteLanguage documentLanguageIds={documentLanguageIds} />
    </div>
  )
}

export default Header
