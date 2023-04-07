import type { NextPage } from "next"

import { StaticData } from "^components/my-pages/document/article-like/_types"
import PageContent from "^components/my-pages/document/article-like/blog"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/my-pages/document/article-like/blog/staticData"

const BlogPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default BlogPage
