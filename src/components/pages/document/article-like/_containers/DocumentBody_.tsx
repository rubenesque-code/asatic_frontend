import { Fragment } from "react"

import { reorderSections } from "^helpers/manipulateEntity"

import { StaticData } from "../_types"

import { $TextSection_, $ImageSection_, $VideoSection_ } from "../_presentation"

import { $DocumentBody } from "../_styles"

export const DocumentBody_ = ({
  body,
}: {
  body: StaticData["entity"]["translations"][number]["body"]
}) => {
  const ordered = reorderSections(body)

  return (
    <$DocumentBody>
      {ordered.map((section) => (
        <Fragment key={section.id}>
          {section.type === "image" ? (
            <$ImageSection_ section={section} />
          ) : section.type === "text" ? (
            <$TextSection_ data={section} />
          ) : (
            <$VideoSection_ section={section} />
          )}
        </Fragment>
      ))}
    </$DocumentBody>
  )
}
