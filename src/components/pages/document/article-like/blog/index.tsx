import { mapIds } from "^helpers/data"

import { StaticData } from "../_types"

import Header from "^components/header"
import { $PageBody } from "^components/pages/_styles"
import { Document_ } from "../_containers"
import { $DocumentContainer_ } from "../../_presentation"

const PageContent = ({ entity: blog, header }: StaticData) => {
  return (
    <>
      <Header {...header} documentLanguageIds={mapIds(blog.languages)} />
      <$PageBody>
        <$DocumentContainer_>
          <Document_ {...blog} />
        </$DocumentContainer_>
      </$PageBody>
    </>
  )
}

export default PageContent
