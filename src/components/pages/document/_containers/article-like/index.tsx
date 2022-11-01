import tw from 'twin.macro'

import {
  ArticleLikeTextSection,
  ArticleLikeImageSection,
  Publishable,
  Image,
  ArticleLikeVideoSection,
} from '^types/index'

import { mapIds } from '^helpers/data'

import HtmlStrToJSX from '^components/HtmlStrToJSX'
import StorageImage from '^components/StorageImage'
import { $Date, $TextSection, $Caption } from '../../_styles/article-like'
import Video_ from '../Video'

export const Date_ = ({ date }: { date: Publishable['publishDate'] }) => {
  if (!date) {
    return null
  }

  return <$Date>{date}</$Date>
}

export const TextSection_ = ({ data }: { data: ArticleLikeTextSection }) => {
  if (!data.text) {
    return null
  }

  return (
    <$TextSection className="custom-prose">
      <HtmlStrToJSX text={data.text} />
    </$TextSection>
  )
}

export const ImageSection_ = ({
  section,
  fetchedImages,
}: {
  section: ArticleLikeImageSection
  fetchedImages: Image[]
}) => {
  if (!section.image.imageId) {
    return null
  }
  if (!mapIds(fetchedImages).includes(section.image.imageId)) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = fetchedImages.find(
    (image) => image.id === section.image.imageId
  )!

  return (
    <div>
      <div css={[tw`relative aspect-ratio[16 / 9]`]}>
        <StorageImage image={image} />
      </div>
      {section.image.caption ? (
        <$Caption>{section.image.caption}</$Caption>
      ) : null}
    </div>
  )
}

export const VideoSection_ = ({
  section,
}: {
  section: ArticleLikeVideoSection
}) => {
  if (!section.video.youtubeId) {
    return null
  }

  return (
    <div>
      <Video_ youtubeId={section.video.youtubeId} />
      {section.video.caption ? (
        <$Caption>{section.video.caption}</$Caption>
      ) : null}
    </div>
  )
}
