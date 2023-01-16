import { StaticData } from "./staticData"

import Header from "^components/header"
import { $PageBody } from "^components/pages/_styles"
import PageBody from "./PageBody"

// □ copy data from cms db-local-data
// □ update changed types: image and text summaries; landing?;

const PageContent = ({ header, landingSections }: StaticData) => {
  // console.log("landingSections:", landingSections)
  return (
    <>
      <Header {...header} />
      <$PageBody>
        <PageBody landingSections={landingSections} />
      </$PageBody>
    </>
  )
}

export default PageContent
