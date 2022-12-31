import { mapIds } from "^helpers/data"

import { $BodyContainer_ } from "^page-presentation"
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
      <$BodyContainer_>
        <Document {...recordedEvent} />
      </$BodyContainer_>
    </div>
  )
}

export default PageContent
