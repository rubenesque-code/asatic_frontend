import { Fragment } from "react"

import { reorderSections } from "^helpers/manipulateEntity"

import { StaticData } from "../_types"

import { $ImageSection_, $VideoSection_, $Footnotes_ } from "../_presentation"

import { $DocumentBody } from "../_styles"
import Prose_ from "../../_containers/Prose_"
import Table_ from "./Table_"

export const DocumentBody_ = ({
  body,
  footnotes,
}: {
  body: StaticData["pageData"]["articleLikeEntity"]["translations"][number]["body"]
  footnotes: StaticData["pageData"]["articleLikeEntity"]["translations"][number]["footnotes"]
}) => {
  const ordered = reorderSections(body)

  const tables = body.flatMap((s) => (s.type === "table" ? [s] : []))

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
            <Table_
              table={section}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              tableNum={tables.findIndex((t) => t.id === section.id)! + 1}
            />
          )}
        </Fragment>
      ))}
      <$Footnotes_ footnotes={footnotes} />
    </$DocumentBody>
  )
}
