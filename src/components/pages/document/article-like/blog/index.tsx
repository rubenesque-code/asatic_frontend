import Header from "^components/header"
import { StaticData } from "../_types"
import { Document_ } from "../_containers"
import { $BodyContainer_ } from "^page-presentation"

const PageContent = ({ entity: blog, header }: StaticData) => {
  return (
    <div>
      <Header {...header} />
      <$BodyContainer_>
        <Document_ {...blog} />
      </$BodyContainer_>
    </div>
  )
}

export default PageContent
