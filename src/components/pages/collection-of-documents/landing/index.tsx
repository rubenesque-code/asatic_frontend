import { StaticData } from "./staticData"

import PageBody from "./PageBody"
import { PageWrapper_ } from "^components/pages/_containers"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageWrapper_ globalData={globalData}>
      <PageBody pageData={pageData} />
    </PageWrapper_>
  )
}

export default PageContent
