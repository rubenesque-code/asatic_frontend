import { $PageBody } from "^components/pages/_styles"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { $nonDocumentMaxWidth } from "^styles/global"
import { ReactElement } from "react"

export const $PageLayout = ({
  children: pageBody,
  header,
}: {
  children: ReactElement[]
  header: ReactElement
}) => {
  return (
    <>
      {header}
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <div>{pageBody}</div>
        </$CenterMaxWidth_>
      </$PageBody>
    </>
  )
}
