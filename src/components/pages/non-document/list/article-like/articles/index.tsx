import { StaticData } from "../_types"

import { $PageBody } from "^components/pages/_styles"
import Header from "^components/header"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { $nonDocumentMaxWidth } from "^styles/global"
import { PageBody_ } from "../_containers"

const ArticlesPage = ({ articleLikeEntities, header }: StaticData) => {
  return (
    <>
      <Header {...header} />
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <PageBody_ articleLikeEntities={articleLikeEntities} />
        </$CenterMaxWidth_>
      </$PageBody>
    </>
  )
}

export default ArticlesPage
