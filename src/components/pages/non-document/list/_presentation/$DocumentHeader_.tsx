import { ReactElement } from "react"
import tw from "twin.macro"

export const $DocumentHeader_ = ({
  languageSort,
  title,
}: {
  languageSort: ReactElement | null
  title: string
}) => {
  return (
    <div css={[tw`pb-sm border-b`, !languageSort && tw`pb-lg`]}>
      <h2 css={[tw`text-center text-3xl capitalize`]}>{title}</h2>
      {languageSort ? (
        <div css={[tw`mt-lg pl-sm md:pl-md`]}>{languageSort}</div>
      ) : null}
    </div>
  )
}
