import type { NextPage } from "next"

import { StaticData } from "^components/pages/list/article-like/_types"
import PageContent from "^components/pages/list/article-like/articles"

export { getStaticProps } from "^components/pages/list/article-like/articles/staticData"

const ArticlesPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default ArticlesPage
