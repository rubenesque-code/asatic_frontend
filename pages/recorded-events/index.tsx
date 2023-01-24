import type { NextPage } from "next"

import { StaticData } from "^components/pages/list/recorded-events/staticData"
import PageContent from "^components/pages/list/recorded-events"

export { getStaticProps } from "^components/pages/list/recorded-events/staticData"

const RecordedEventsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default RecordedEventsPage
