import { mapIds } from "^helpers/data"

import { StaticData } from "../_types"

import Header from "^components/header"
import { $PageBody } from "^components/pages/_styles"
import { Document_ } from "../_containers"
import { $CenterMaxWidth_ } from "../../_presentation"
import { $textSectionMaxWidth } from "^styles/global"
import tw from "twin.macro"

const PageContent = ({ entity: article, header }: StaticData) => {
  return (
    <>
      <Header {...header} documentLanguageIds={mapIds(article.languages)} />
      <$PageBody>
        <$CenterMaxWidth_
          maxWidth={$textSectionMaxWidth}
          styles={tw`px-sm sm:px-md`}
        >
          <Document_ {...article} />
        </$CenterMaxWidth_>
      </$PageBody>
    </>
  )
}

export default PageContent
