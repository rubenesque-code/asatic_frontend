import { StaticData } from "./staticData"

import { $PageBody } from "^components/pages/_styles"
import Header from "^components/header"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { $nonDocumentMaxWidth } from "^styles/global"
import PageBody from "./PageBody"

const SubjectsPage = ({ subjects, header }: StaticData) => {
  return (
    <>
      <Header {...header} />
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <PageBody {...subjects} />
        </$CenterMaxWidth_>
      </$PageBody>
    </>
  )
}

export default SubjectsPage
