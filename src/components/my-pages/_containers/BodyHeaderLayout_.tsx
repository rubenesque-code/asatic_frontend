import { CSSInterpolation } from "@emotion/css"
import { ComponentProps } from "react"
import tw from "twin.macro"

import { $ContentSectionLayout_ } from "^components/my-pages/_presentation"
import { Languages_ } from "./Languages_"

// · pass padding to component that sets maxwidth ∵ it's a content-box

export const BodyHeaderLayout_ = ({
  title,
  languages,
  useMargin,
  styles,
}: {
  title: string | { text: string; align: "center" | "left" }
  languages?: Pick<
    ComponentProps<typeof Languages_>,
    "documentLanguage" | "documentLanguages"
  >
  useMargin?: boolean
  styles?: CSSInterpolation
}) => {
  return (
    <div css={[tw`border-b pt-xl pb-md`]}>
      <$ContentSectionLayout_
        // styles={alignLeft ? $pl : undefined}
        useMargin={useMargin}
        styles={styles}
      >
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
          <Languages_ {...languages} styles={[tw`pt-md`, tw`px-xs sm:px-0`]} />
        ) : null}
      </$ContentSectionLayout_>
    </div>
  )
}
