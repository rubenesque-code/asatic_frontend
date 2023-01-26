import { StaticData } from "./staticData"
import Document from "./Document"
import { $PageBody } from "^components/pages/_styles"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({ globalData, pageData }: StaticData) => {
  return (
    <PageLayout_ globalData={globalData}>
      <$PageBody>
        <Document pageData={pageData} />
      </$PageBody>
    </PageLayout_>
  )
}

export default PageContent
