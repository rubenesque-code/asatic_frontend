import { ReactElement } from "react"
import tw from "twin.macro"

export const $BodyContainer_ = ({
  children,
}: {
  children: ReactElement | ReactElement[]
}) => (
  <div css={[tw`flex justify-center px-sm mt-2xl`]}>
    <div css={[tw`max-w-[628.41px]`]}>{children}</div>
  </div>
)
