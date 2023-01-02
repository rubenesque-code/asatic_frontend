import { ReactElement } from "react"
import tw from "twin.macro"

export const $DocumentContainer_ = ({
  children,
}: {
  children: ReactElement
}) => (
  <div css={[tw`flex justify-center`]}>
    <div css={tw`w-full max-w-[628.41px]`}>{children}</div>
  </div>
)
