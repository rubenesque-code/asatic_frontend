import { StaticData } from "../_types"

import { $BodyContainer_ } from "^page-presentation"
import Header from "^components/header"
import { Document_ } from "../_containers"

const PageContent = ({ entity: article, header }: StaticData) => {
  return (
    <div>
      <Header {...header} />
      <$BodyContainer_>
        <Document_ {...article} />
      </$BodyContainer_>
    </div>
  )
}

export default PageContent
