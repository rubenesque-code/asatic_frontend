import { ComponentProps } from "react"
import tw from "twin.macro"

import { $ContentSectionLayout_ } from "^components/pages/_presentation"
import { Languages_ } from "./Languages_"

export const BodyHeaderLayout_ = ({
  title,
  languages,
}: {
  title: string | { text: string; align: "center" | "left" }
  languages?: Pick<
    ComponentProps<typeof Languages_>,
    "documentLanguage" | "documentLanguages"
  >
}) => {
  return (
    <div css={[tw`border-b pt-xl pb-md`]}>
      <$ContentSectionLayout_>
        <h1
          css={[
            tw`text-3xl capitalize text-gray-700`,
            typeof title === "object" && title.align === "left"
              ? tw`text-left`
              : tw`text-center`,
          ]}
        >
          {typeof title === "string" ? title : title.text}
        </h1>
        {languages ? (
          <Languages_ {...languages} styles={tw`pt-md pl-xs sm:pl-sm`} />
        ) : null}
      </$ContentSectionLayout_>
    </div>
  )
}
