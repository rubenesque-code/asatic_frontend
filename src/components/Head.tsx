import NextHead from "next/head"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const Head = (props: { pageTitle?: string }) => {
  const { siteLanguage } = useSiteLanguageContext()
  const siteName = siteTranslations.siteName[siteLanguage.id]

  const pageTitle = props.pageTitle ? `· ${props.pageTitle}` : ""
  const title = siteName + pageTitle

  return (
    <NextHead>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="News site." />
    </NextHead>
  )
}

export default Head
