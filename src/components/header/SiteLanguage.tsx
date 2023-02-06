import Link from "next/link"
import { useRouter } from "next/router"
import tw from "twin.macro"

import { useGlobalDataContext } from "^context/GlobalData"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import { TranslateIcon } from "^components/Icons"
import { siteTranslations } from "^constants/siteTranslations"

const SiteLanguage = () => {
  const { siteLanguage } = useSiteLanguageContext()
  const { documentLanguageIds } = useGlobalDataContext()

  const router = useRouter()

  const siteLanguageIdOnToggle =
    siteLanguage.id === "english" ? "tamil" : "english"

  const changeDocLanguageIdToSiteLanguageId = documentLanguageIds?.includes(
    siteLanguageIdOnToggle
  )

  return (
    <div css={[tw`flex gap-xs `]}>
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
        <span
          css={[
            siteLanguage.id === "english"
              ? tw`font-sans-primary-tamil`
              : tw`font-sans-primary`,
            tw`font-light cursor-pointer`,
          ]}
        >
          {siteLanguage.id === "english" ? siteTranslations.tamil : "English"}
        </span>
      </Link>
    </div>
  )
}

export default SiteLanguage
