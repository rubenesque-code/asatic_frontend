import type { NextPage } from "next"

import { StaticData } from "^components/pages/document/article/staticData"
import PageContent from "^components/pages/document/article"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/document/article/staticData"

const ArticlePage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default ArticlePage
