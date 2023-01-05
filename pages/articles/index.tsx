import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/article-like/_types"
import PageContent from "^components/pages/non-document/article-like/articles"

export { getStaticProps } from "^components/pages/non-document/article-like/articles/staticData"

const ArticlesPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default ArticlesPage
