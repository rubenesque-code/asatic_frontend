import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/contributor/staticData"
import PageContent from "^components/pages/non-document/contributor"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/non-document/contributor/staticData"

const AuthorPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default AuthorPage
