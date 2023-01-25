import type { NextPage } from "next"

import { StaticData } from "^components/pages/collection-of-documents/article-like/_types"
import PageContent from "^components/pages/collection-of-documents/article-like/articles"

export { getStaticProps } from "^components/pages/collection-of-documents/article-like/articles/staticData"

const ArticlesPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default ArticlesPage
