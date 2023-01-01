import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/subject/staticData"
import PageContent from "^components/pages/non-document/subject"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/non-document/subject/staticData"

const SubjectPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default SubjectPage
