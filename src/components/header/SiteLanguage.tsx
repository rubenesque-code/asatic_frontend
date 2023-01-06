import Link from "next/link"
import { useRouter } from "next/router"
import tw from "twin.macro"

import { TranslateIcon } from "^components/Icons"
import { useSiteLanguageContext } from "^context/SiteLanguage"

export type SiteLanguageProps = {
  documentLanguageIds?: string[]
}

const SiteLanguage = ({ documentLanguageIds }: SiteLanguageProps) => {
  const { siteLanguage } = useSiteLanguageContext()
  const router = useRouter()

  const siteLanguageIdOnToggle =
    siteLanguage.id === "english" ? "tamil" : "english"

  const changeDocLanguageIdToSiteLanguageId = documentLanguageIds?.includes(
    siteLanguageIdOnToggle
  )

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
            siteLanguageId: siteLanguageIdOnToggle,
            ...(changeDocLanguageIdToSiteLanguageId && {
              documentLanguageId: siteLanguageIdOnToggle,
            }),
          },
        }}
        shallow={true}
        replace={true}
        passHref
      >
        <span css={[tw`font-sans-primary font-light cursor-pointer`]}>
          {siteLanguage.id === "english" ? "Tamil" : "English"}
        </span>
      </Link>
    </div>
  )
}

export default SiteLanguage
