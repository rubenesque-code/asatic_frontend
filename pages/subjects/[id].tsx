import type { NextPage } from "next"

import { StaticData } from "^components/pages/collection-of-documents/subject/staticData"
import PageContent from "^components/pages/collection-of-documents/subject"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/collection-of-documents/subject/staticData"

const SubjectPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default SubjectPage
