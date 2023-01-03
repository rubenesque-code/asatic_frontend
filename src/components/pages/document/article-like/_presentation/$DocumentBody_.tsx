// imports
import tw from "twin.macro"

import HtmlStrToJSX from "^components/HtmlStrToJSX"
import StorageImage from "^components/StorageImage"

import { StaticData } from "../_types"

import { Video_ } from "../../_containers"

import { $TextSection, $Caption } from "../_styles"

type Section = StaticData["entity"]["translations"][number]["body"][number]

type TextSection = Extract<Section, { type: "text" }>
type ImageSection = Extract<Section, { type: "image" }>
type VideoSection = Extract<Section, { type: "video" }>

export const $TextSection_ = ({ data }: { data: TextSection }) => (
  <$TextSection className="custom-prose">
    <HtmlStrToJSX htmlStr={data.text} />
  </$TextSection>
)

export const $ImageSection_ = ({ section }: { section: ImageSection }) => (
  <div>
    <div css={[tw`relative aspect-ratio[16 / 9]`]}>
      <StorageImage image={section.image.storageImage} />
    </div>
    {section.caption ? <$Caption>{section.caption}</$Caption> : null}
  </div>
)

export const $VideoSection_ = ({ section }: { section: VideoSection }) => (
  <div>
    <Video_ youtubeId={section.youtubeId} />
    {section.caption ? <$Caption>{section.caption}</$Caption> : null}
  </div>
)
