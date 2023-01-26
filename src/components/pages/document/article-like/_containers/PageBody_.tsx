import { StaticData } from "../_types"
import { Document_ } from "./Document_"
import { $DocumentMaxWidthContainer } from "^components/pages/document/_presentation"

const PageBody_ = ({ pageData }: { pageData: StaticData["pageData"] }) => {
  return (
    <$DocumentMaxWidthContainer>
      <Document_ pageData={pageData} />
    </$DocumentMaxWidthContainer>
  )
}

export default PageBody_
