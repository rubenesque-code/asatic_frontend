import Link from "next/link"
import { useRouter } from "next/router"
import tw from "twin.macro"

import { TranslateIcon } from "^components/Icons"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const SiteLanguage = () => {
  const { siteLanguage } = useSiteLanguageContext()
  const router = useRouter()

  return (
    <div css={[tw`flex gap-xs`]}>
      <span css={[tw`text-gray-400`]}>
        <TranslateIcon weight="thin" />
      </span>
      <Link
        href={{
          pathname: router.pathname,
          query: {
            ...router.query,
            siteLanguageId: siteLanguage.id === "english" ? "tamil" : "english",
          },
        }}
        passHref
      >
        <span css={[tw`font-sans-2 font-light cursor-pointer`]}>
          {siteLanguage.id === "english" ? "Tamil" : "English"}
        </span>
      </Link>
    </div>
  )
}

export default SiteLanguage
