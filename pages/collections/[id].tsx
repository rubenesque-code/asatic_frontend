import type { NextPage } from "next"

import { StaticData } from "^components/pages/collection-of-documents/collection/staticData"
import PageContent from "^components/pages/collection-of-documents/collection"

export {
  getStaticPaths,
  getStaticProps,
} from "^components/pages/collection-of-documents/collection/staticData"

const CollectionPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />
}

export default CollectionPage
