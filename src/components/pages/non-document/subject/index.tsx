import { mapIds } from "^helpers/data"

import { $BodyContainer_ } from "^page-presentation"
import Header from "^components/header"
import { StaticData } from "./staticData"

const PageContent = ({ header, recordedEvent }: StaticData) => {
  return (
    <div>
      <Header
        {...header}
        documentLanguageIds={mapIds(recordedEvent.languages)}
      />
      <$BodyContainer_>
        <div>Subject</div>
      </$BodyContainer_>
    </div>
  )
}

export default PageContent
