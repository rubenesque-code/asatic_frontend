import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/list/article-like/_types"
import PageContent from "^components/pages/non-document/list/article-like/blogs"

export { getStaticProps } from "^components/pages/non-document/list/article-like/blogs/staticData"

const BlogsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default BlogsPage
