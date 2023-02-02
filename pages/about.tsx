import type { NextPage } from "next"

import { StaticData } from "^components/pages/other/about/staticData"
import PageContent from "^components/pages/other/about"

export { getStaticProps } from "^components/pages/other/about/staticData"

const About: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default About
