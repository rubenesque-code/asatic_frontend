import { ReactElement } from 'react'
import tw from 'twin.macro'

export const $Container_ = ({
  children,
}: {
  children: ReactElement | ReactElement[]
}) => (
  <div css={[tw`flex justify-center`]}>
    <div css={[tw`max-w-[800px] px-sm`]}>{children}</div>
  </div>
)
