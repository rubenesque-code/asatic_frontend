import { mapIds } from "^helpers/data"

import Header from "^components/header"
import { StaticData } from "./staticData"
import Document from "./Document"
import { $PageBody } from "^components/pages/_styles"

const PageContent = ({ header, recordedEvent }: StaticData) => {
  return (
    <>
      <Header
        {...header}
        documentLanguageIds={mapIds(recordedEvent.languages)}
      />
      <$PageBody>
        <Document {...recordedEvent} />
      </$PageBody>
    </>
  )
}

export default PageContent
