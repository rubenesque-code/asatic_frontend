import { StaticData } from "./staticData"

import Header from "^components/header"
import PageBody from "./PageBody"
import { GlobalDataProvider } from "^context/GlobalData"

const PageContent = ({
  header,
  landingSections,
  isMultipleAuthors,
}: StaticData) => {
  return (
    <GlobalDataProvider isMultipleAuthors={isMultipleAuthors}>
      <>
        <Header {...header} />
        <PageBody landingSections={landingSections} />
      </>
    </GlobalDataProvider>
  )
}

export default PageContent
