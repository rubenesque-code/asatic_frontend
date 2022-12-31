import { StaticData } from "../_types"

import { $BodyContainer_ } from "^page-presentation"
import Header from "^components/header"
import { Document_ } from "../_containers"
import { mapIds } from "^helpers/data"

const PageContent = ({ entity: article, header }: StaticData) => {
  return (
    <div>
      <Header {...header} documentLanguageIds={mapIds(article.languages)} />
      <$BodyContainer_>
        <Document_ {...article} />
      </$BodyContainer_>
    </div>
  )
}

export default PageContent
