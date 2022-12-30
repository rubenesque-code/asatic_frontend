import produce from "immer"
import { Fragment } from "react"

import {
  TextSection_,
  ImageSection_,
  VideoSection_,
} from "../_containers/article-like"
import { $Body } from "../_styles/article-like"
import { StaticData } from "../_types/article-like"

const Body = ({
  body,
}: {
  body: StaticData["article"]["translations"][number]["body"]
}) => {
  const ordered = produce(body, (draft) => {
    draft.sort((a, b) => a.index - b.index)
  })

  return (
    <$Body>
      {ordered.map((section) => (
        <Fragment key={section.id}>
          {section.type === "image" ? (
            <ImageSection_ section={section} />
          ) : section.type === "text" ? (
            <TextSection_ data={section} />
          ) : (
            <VideoSection_ section={section} />
          )}
        </Fragment>
      ))}
    </$Body>
  )
}

export default Body
