import type { NextPage } from "next"

import { StaticData } from "^components/pages/list/contributors/staticData"
import PageContent from "^components/pages/list/contributors"

export { getStaticProps } from "^components/pages/list/contributors/staticData"

const ContributorsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default ContributorsPage
