import produce from "immer"
import { Fragment } from "react"

import { ArticleLikeTranslation, Image } from "^types/entities"

import {
  TextSection_,
  ImageSection_,
  VideoSection_,
} from "../_containers/article-like"
import { $Body } from "../_styles/article-like"

const Body = ({
  body,
  images,
}: {
  body: ArticleLikeTranslation["body"]
  images: Image[]
}) => {
  const ordered = produce(body, (draft) => {
    draft.sort((a, b) => a.index - b.index)
  })

  return (
    <$Body>
      {ordered.map((section) => (
        <Fragment key={section.id}>
          {section.type === "image" ? (
            <ImageSection_ section={section} fetchedImages={images} />
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
