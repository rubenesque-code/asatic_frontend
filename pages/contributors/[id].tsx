import type { NextPage } from "next"

import { StaticData } from "^components/pages/collection-of-documents/contributor/staticData"
import PageContent from "^components/pages/collection-of-documents/contributor"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/collection-of-documents/contributor/staticData"

const AuthorPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default AuthorPage
