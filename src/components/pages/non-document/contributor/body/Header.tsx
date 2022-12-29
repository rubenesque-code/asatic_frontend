import { ReactElement } from "react"

type Props = {
  languages: ReactElement
  contributor: {
    name: string
  }
}
const ContributorHeader = ({ languages, contributor }: Props) => {
  return (
    <div>
      <div>{languages}</div>
      <div>
        <h2>{contributor.name}</h2>
      </div>
    </div>
  )
}

export default ContributorHeader
