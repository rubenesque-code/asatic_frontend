import { ReactElement } from "react"
import tw, { TwStyle } from "twin.macro"

import { $CenterMaxWidth_ } from "^page-presentation"

export const $DocumentMaxWidthContainer = ({
  children,
  styles,
}: {
  children: ReactElement
  styles?: TwStyle
}) => {
  return (
    <$CenterMaxWidth_ maxWidth={tw`max-w-[628.41px]`} styles={styles}>
      {children}
    </$CenterMaxWidth_>
  )
}
