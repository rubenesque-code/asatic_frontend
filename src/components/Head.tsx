import NextHead from "next/head"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const Head = ({ pageTitle }: { pageTitle?: string }) => {
  const { siteLanguage } = useSiteLanguageContext()
  const siteName = siteTranslations.siteName[siteLanguage.id]

  return (
    <NextHead>
      <title>
        {siteName}
        {!pageTitle ? null : ` · ${pageTitle}`}
      </title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="News site." />
    </NextHead>
  )
}

export default Head
