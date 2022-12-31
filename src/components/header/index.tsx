import tw from "twin.macro"

import SideBar, { SideBarProps } from "./SideBar"
import SiteLanguage, { SiteLanguageProps } from "./SiteLanguage"

export type HeaderProps = SideBarProps & SiteLanguageProps

const Header = ({ subjects, documentLanguageIds }: HeaderProps) => {
  return (
    <div
      css={[tw`flex justify-between items-center pt-md px-md pb-md border-b`]}
    >
      <div>
        <SideBar subjects={subjects} />
      </div>
      <div css={[tw`text-2xl font-bold font-documentTitle`]}>Asatic</div>
      <SiteLanguage documentLanguageIds={documentLanguageIds} />
    </div>
  )
}

export default Header
