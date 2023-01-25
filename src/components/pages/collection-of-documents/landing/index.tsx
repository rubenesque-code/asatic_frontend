import { StaticData } from "./staticData"

import PageBody from "./PageBody"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <PageBody pageData={pageData} />
    </PageLayout_>
  )
}

export default PageContent
