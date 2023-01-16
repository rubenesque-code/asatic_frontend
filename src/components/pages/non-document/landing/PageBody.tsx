import { StaticData } from "./staticData"

const PageBody = ({
  landingSections,
}: {
  landingSections: StaticData["landingSections"]
}) => {
  return <div>{JSON.stringify(landingSections)}</div>
}

export default PageBody
