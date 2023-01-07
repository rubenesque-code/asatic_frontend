import type { NextPage } from "next"

import { StaticData } from "^components/pages/non-document/collection/staticData"
import PageContent from "^components/pages/non-document/collection"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/non-document/collection/staticData"

const CollectionPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default CollectionPage
