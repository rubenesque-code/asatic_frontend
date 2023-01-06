import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/article-like/_types"
import PageContent from "^components/pages/non-document/article-like/blogs"

export { getStaticProps } from "^components/pages/non-document/article-like/blogs/staticData"

const BlogsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default BlogsPage
