import tw from "twin.macro"

import { TextSection, ImageSection, VideoSection, Image } from "^types/entities"

import { mapIds } from "^helpers/data"

import HtmlStrToJSX from "^components/HtmlStrToJSX"
import StorageImage from "^components/StorageImage"
import { $Date, $TextSection, $Caption } from "../../_styles/article-like"
import Video_ from "../Video"

export const Date_ = ({ date }: { date: string }) => {
  if (!date) {
    return null
  }

  return <$Date>{date}</$Date>
}

export const TextSection_ = ({ data }: { data: TextSection }) => {
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
  section: ImageSection
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
      {section.caption ? <$Caption>{section.caption}</$Caption> : null}
    </div>
  )
}

export const VideoSection_ = ({ section }: { section: VideoSection }) => {
  if (!section.youtubeId) {
    return null
  }

  return (
    <div>
      <Video_ youtubeId={section.youtubeId} />
      {section.caption ? <$Caption>{section.caption}</$Caption> : null}
    </div>
  )
}
