import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/landing/staticData"
import PageContent from "^components/pages/non-document/landing"

export { getStaticProps } from "^components/pages/non-document/landing/staticData"

const Home: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default Home
