import type { NextPage } from "next"

import { StaticData } from "^components/pages/document/blog/staticData"
import PageContent from "^components/pages/document/blog"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/document/blog/staticData"

const BlogPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default BlogPage
