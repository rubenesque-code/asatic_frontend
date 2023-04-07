import type { NextPage } from "next"

import { StaticData } from "^components/my-pages/other/about/staticData"
import PageContent from "^components/my-pages/other/about"

export { getStaticProps } from "^components/my-pages/other/about/staticData"

const About: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default About
