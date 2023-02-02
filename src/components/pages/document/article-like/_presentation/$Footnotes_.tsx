import tw from "twin.macro"
import { StaticData } from "../_types"

export const $Footnotes_ = ({
  footnotes,
}: {
  footnotes: StaticData["pageData"]["articleLikeEntity"]["translations"][number]["footnotes"]
}) => {
  if (!footnotes) {
    return null
  }

  return (
    <div css={[tw`flex flex-col gap-sm pt-md border-t mt-2xl`]}>
      {footnotes.text.map((footnote) => (
        <div
          css={[tw`flex gap-sm`]}
          id={`ft-text-${footnote.id}`}
          key={footnote.id}
        >
          <span css={[tw`text-xs text-gray-600`]}>{footnote.num}</span>
          <span css={[tw`text-gray-700`]}>{footnote.text}</span>
        </div>
      ))}
    </div>
  )
}
