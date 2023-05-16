import type { NextPage } from "next"

import { StaticData } from "^components/my-pages/document/article-like/_types"
import PageContent from "^components/my-pages/document/article-like/article"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/my-pages/document/article-like/article/staticData"

const ArticlePage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default ArticlePage
