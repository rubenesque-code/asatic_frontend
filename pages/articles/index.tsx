import type { NextPage } from "next"

import { StaticData } from "^components/my-pages/collection-of-documents/article-like/articles/staticData"
import PageContent from "^components/my-pages/collection-of-documents/article-like/articles"

export { getStaticProps } from "^components/my-pages/collection-of-documents/article-like/articles/staticData"

const ArticlesPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default ArticlesPage
