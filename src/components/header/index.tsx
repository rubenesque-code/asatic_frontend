import tw from "twin.macro"
import { Subject } from "^types/subject"

import SideBar from "./SideBar"
import SiteLanguage from "./SiteLanguage"

const Header = ({ subjects }: { subjects: Subject[] }) => {
  return (
    <div css={[tw`flex justify-between items-center pt-md px-md`]}>
      <div>
        <SideBar />
      </div>
      <div css={[tw`text-2xl font-bold font-documentTitle`]}>Asatic</div>
      <SiteLanguage />
    </div>
  )
}

export default Header
