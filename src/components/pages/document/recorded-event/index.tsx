import { mapIds } from "^helpers/data"

import { $ContentContainer_ } from "^page-presentation"
import Header from "^components/header"
import { StaticData } from "./staticData"
import Document from "./Document"

const PageContent = ({ header, recordedEvent }: StaticData) => {
  return (
    <div>
      <Header
        {...header}
        documentLanguageIds={mapIds(recordedEvent.languages)}
      />
      <$ContentContainer_>
        <Document {...recordedEvent} />
      </$ContentContainer_>
    </div>
  )
}

export default PageContent
