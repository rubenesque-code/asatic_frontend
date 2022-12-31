import type { NextPage } from "next"

import { StaticData } from "^components/pages/document/recorded-event/staticData"
import PageContent from "^components/pages/document/recorded-event"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/document/recorded-event/staticData"

const RecordedEventPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default RecordedEventPage
