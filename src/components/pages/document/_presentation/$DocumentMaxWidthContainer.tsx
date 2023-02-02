import { ReactElement } from "react"
import tw, { TwStyle } from "twin.macro"
import { useWindowSize } from "react-use"

import { $CenterMaxWidth_ } from "^page-presentation"

export const $DocumentMaxWidthContainer = ({
  children,
  styles,
}: {
  children: ReactElement
  styles?: TwStyle
}) => {
  const windowSize =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    typeof window !== undefined ? useWindowSize() : { width: 5000 }

  return (
    <$CenterMaxWidth_
      maxWidth={
        windowSize.width < 640 ? tw`max-w-[558.588px]` : tw`max-w-[628.41px]`
      }
      styles={styles}
    >
      {children}
    </$CenterMaxWidth_>
  )
}
