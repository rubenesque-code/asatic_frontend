import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/recorded-events/staticData"
import PageContent from "^components/pages/non-document/recorded-events"

export { getStaticProps } from "^components/pages/non-document/recorded-events/staticData"

const RecordedEventsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default RecordedEventsPage
