import type { NextPage } from "next"

import { StaticData } from "^components/pages/list/subjects/staticData"
import PageContent from "^components/pages/list/subjects"

export { getStaticProps } from "^components/pages/list/subjects/staticData"

const SubjectsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default SubjectsPage
