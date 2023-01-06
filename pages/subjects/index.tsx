import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/subjects/staticData"
import PageContent from "^components/pages/non-document/subjects"

export { getStaticProps } from "^components/pages/non-document/subjects/staticData"

const SubjectsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default SubjectsPage
