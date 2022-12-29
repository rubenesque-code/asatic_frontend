import { ReactElement } from "react"
import tw from "twin.macro"

type Props = {
  languages: ReactElement
  contributor: {
    name: string
  }
}

const $Name = tw.h1`text-3xl text-gray-900 font-documentTitle line-height[1.5em]`

const ContributorHeader = ({ languages, contributor }: Props) => {
  return (
    <div css={[tw`pb-xl`]}>
      <div>{languages}</div>
      <div>
        <$Name>{contributor.name}</$Name>
      </div>
    </div>
  )
}

export default ContributorHeader
