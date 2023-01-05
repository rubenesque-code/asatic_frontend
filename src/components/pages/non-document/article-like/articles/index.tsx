import { StaticData } from "../_types"

import { $PageBody } from "^components/pages/_styles"
import Header from "^components/header"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { $nonDocumentMaxWidth } from "^styles/global"
import Body from "./Body"

const ArticlesPage = ({ articleLikeEntities, header }: StaticData) => {
  return (
    <>
      <Header {...header} />
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <Body articleLikeEntities={articleLikeEntities} />
        </$CenterMaxWidth_>
      </$PageBody>
    </>
  )
}

export default ArticlesPage
