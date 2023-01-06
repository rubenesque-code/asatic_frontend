import { StaticData } from "./staticData"

import { $PageBody } from "^components/pages/_styles"
import Header from "^components/header"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { $nonDocumentMaxWidth } from "^styles/global"
import PageBody from "./PageBody"

const RecordedEventsPage = ({ recordedEvents, header }: StaticData) => {
  return (
    <>
      <Header {...header} />
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <PageBody {...recordedEvents} />
        </$CenterMaxWidth_>
      </$PageBody>
    </>
  )
}

export default RecordedEventsPage
