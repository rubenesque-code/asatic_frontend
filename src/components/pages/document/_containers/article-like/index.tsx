import tw from "twin.macro"

import HtmlStrToJSX from "^components/HtmlStrToJSX"
import StorageImage from "^components/StorageImage"
import { $Date, $TextSection, $Caption } from "../../_styles/article-like"
import { StaticData } from "../../_types/article-like"
import Video_ from "../Video"

export const Date_ = ({ date }: { date: string }) => {
  if (!date) {
    return null
  }

  return <$Date>{date}</$Date>
}

type Section = StaticData["article"]["translations"][number]["body"][number]

type TextSection = Extract<Section, { type: "text" }>
type ImageSection = Extract<Section, { type: "image" }>
type VideoSection = Extract<Section, { type: "video" }>

export const TextSection_ = ({ data }: { data: TextSection }) => {
  return (
    <$TextSection className="custom-prose">
      <HtmlStrToJSX text={data.text} />
    </$TextSection>
  )
}

export const ImageSection_ = ({ section }: { section: ImageSection }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  return (
    <div>
      <div css={[tw`relative aspect-ratio[16 / 9]`]}>
        <StorageImage image={section.image.storageImage} />
      </div>
      {section.caption ? <$Caption>{section.caption}</$Caption> : null}
    </div>
  )
}

export const VideoSection_ = ({ section }: { section: VideoSection }) => {
  return (
    <div>
      <Video_ youtubeId={section.youtubeId} />
      {section.caption ? <$Caption>{section.caption}</$Caption> : null}
    </div>
  )
}
