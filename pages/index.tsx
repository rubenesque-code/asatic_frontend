import type { NextPage } from "next"

import { StaticData } from "^components/pages/collection-of-documents/landing/staticData"
import PageContent from "^components/pages/collection-of-documents/landing"

export { getStaticProps } from "^components/pages/collection-of-documents/landing/staticData"

const Home: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default Home
