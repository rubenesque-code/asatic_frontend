import tw from "twin.macro"
import { TranslateIcon } from "^components/Icons"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const SiteLanguage = () => {
  const {
    siteLanguageId: siteLanguage,
    toggleSiteLanguage: toggleSiteLanguage,
  } = useSiteLanguageContext()

  return (
    <div css={[tw`flex gap-xs`]}>
      <span css={[tw`text-gray-400`]}>
        <TranslateIcon weight="thin" />
      </span>
      <button
        css={[tw`font-sans-2 font-light`]}
        onClick={toggleSiteLanguage}
        type="button"
      >
        <span>{siteLanguage === "english" ? "Tamil" : "English"}</span>
      </button>
    </div>
  )
}

export default SiteLanguage
