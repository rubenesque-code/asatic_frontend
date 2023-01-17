import { StaticData } from "./staticData"

import Header from "^components/header"
import PageBody from "./PageBody"

const PageContent = ({ header, landingSections }: StaticData) => {
  console.log("landingSections:", landingSections)
  return (
    <>
      <Header {...header} />
      <PageBody landingSections={landingSections} />
    </>
  )
}

export default PageContent
