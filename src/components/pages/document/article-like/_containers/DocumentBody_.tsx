import { Fragment } from "react"

import { reorderSections } from "^helpers/manipulateEntity"

import { StaticData } from "../_types"

import { $ImageSection_, $VideoSection_ } from "../_presentation"

import { $DocumentBody } from "../_styles"
import Prose_ from "../../_containers/Prose_"
import tw from "twin.macro"

export const DocumentBody_ = ({
  body,
  footnotes,
}: {
  body: StaticData["pageData"]["articleLikeEntity"]["translations"][number]["body"]
  footnotes: StaticData["pageData"]["articleLikeEntity"]["translations"][number]["footnotes"]
}) => {
  const ordered = reorderSections(body)

  return (
    <$DocumentBody>
      {ordered.map((section) => (
        <Fragment key={section.id}>
          {section.type === "image" ? (
            <$ImageSection_ section={section} />
          ) : section.type === "text" ? (
            <Prose_
              htmlStr={section.text}
              validFootnoteIds={footnotes?.idsValid}
            />
          ) : section.type === "video" ? (
            <$VideoSection_ section={section} />
          ) : (
            <p>table</p>
          )}
        </Fragment>
      ))}
      <Footnotes footnotes={footnotes} />
    </$DocumentBody>
  )
}

const Footnotes = ({
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
