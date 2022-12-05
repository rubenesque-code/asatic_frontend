import tw from "twin.macro"

import SideBar, { SideBarProps } from "./SideBar"
import SiteLanguage from "./SiteLanguage"

export type HeaderProps = SideBarProps

const Header = ({ subjects }: HeaderProps) => {
  return (
    <div
      css={[tw`flex justify-between items-center pt-md px-md pb-md border-b`]}
    >
      <div>
        <SideBar subjects={subjects} />
      </div>
      <div css={[tw`text-2xl font-bold font-documentTitle`]}>Asatic</div>
      <SiteLanguage />
    </div>
  )
}

export default Header
