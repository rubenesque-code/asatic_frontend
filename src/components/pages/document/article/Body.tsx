import { Fragment } from 'react'

import { ArticleLikeTranslation } from '^types/article-like-entity'
import { Image } from '^types/image'

import {
  TextSection_,
  ImageSection_,
  VideoSection_,
} from '../_containers/article-like'
import { $Body } from '../_styles/article-like'

const Body = ({
  body,
  images,
}: {
  body: ArticleLikeTranslation['body']
  images: Image[]
}) => {
  return (
    <$Body>
      {body.map((section) => (
        <Fragment key={section.id}>
          {section.type === 'image' ? (
            <ImageSection_ section={section} fetchedImages={images} />
          ) : section.type === 'text' ? (
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
