// imports
import tw from "twin.macro"

import StorageImage from "^components/StorageImage"

import { StaticData } from "../_types"

import { Video_ } from "../../_containers"

import { $Caption } from "../_styles"

type Section = StaticData["entity"]["translations"][number]["body"][number]

type ImageSection = Extract<Section, { type: "image" }>
type VideoSection = Extract<Section, { type: "video" }>

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
