import { StaticData } from "./staticData"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"

import { PageWrapper_ } from "^components/pages/_containers"

import { PageBody_ } from "../_containers"

const ArticlesPageContent = ({ globalData, pageData }: StaticData) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <PageWrapper_
      globalData={globalData}
      pageTitle={siteTranslations.articles[siteLanguage.id]}
    >
      <PageBody_ pageData={pageData} />
    </PageWrapper_>
  )
}

export default ArticlesPageContent
