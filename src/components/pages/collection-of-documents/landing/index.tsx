import { StaticData } from "./staticData"

import PageBody from "./PageBody"
import { PageLayout_ } from "^components/pages/_containers"

const PageContent = ({
  header,
  landingSections,
  isMultipleAuthors,
}: StaticData) => {
  return (
    <PageLayout_ staticData={{ isMultipleAuthors, subjects: header.subjects }}>
      <PageBody landingSections={landingSections} />
    </PageLayout_>
  )
}

export default PageContent
