import { StaticData } from "./staticData"

import { useSiteLanguageContext } from "^context/SiteLanguage"

import { PageWrapper_ } from "^components/my-pages/_containers"
import { siteTranslations } from "^constants/siteTranslations"
import { PageBody_ } from "../_containers"

const BlogsPageContent = ({ globalData, pageData }: StaticData) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <PageWrapper_
      globalData={globalData}
      pageTitle={siteTranslations.blogs[siteLanguage.id]}
    >
      <PageBody_ pageData={pageData} />
    </PageWrapper_>
  )
}

export default BlogsPageContent
