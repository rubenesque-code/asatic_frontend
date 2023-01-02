import { ReactElement } from "react"
import tw from "twin.macro"

export const $DocumentContainer_ = ({
  children,
}: {
  children: ReactElement | ReactElement[]
}) => (
  <div css={[tw`flex justify-center`]}>
    <div css={[tw`w-full max-w-[1000px]`]}>{children}</div>
  </div>
)
