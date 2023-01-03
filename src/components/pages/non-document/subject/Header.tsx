import tw from "twin.macro"

import { Languages_, Languages_Props } from "^components/pages/_containers"

const DocumentHeader = ({
  title,
  ...languages_props
}: { title: string } & Languages_Props) => {
  return (
    <div css={[tw`pb-sm border-b`]}>
      <h2 css={[tw`text-center text-3xl`]}>{title}</h2>
      <div css={[tw`mt-lg`]}>
        <Languages_ {...languages_props} />
      </div>
    </div>
  )
}

export default DocumentHeader
