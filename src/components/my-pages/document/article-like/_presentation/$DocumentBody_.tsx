// imports
import tw from "twin.macro"

import StorageImage from "^components/StorageImage"

import { StaticData } from "../_types"

import { Video_ } from "../../_containers"

import { $Caption } from "../_styles"

type Section =
  StaticData["pageData"]["articleLikeEntity"]["translations"][number]["body"][number]

type ImageSection = Extract<Section, { type: "image" }>
type VideoSection = Extract<Section, { type: "video" }>

export const $ImageSection_ = ({ section }: { section: ImageSection }) => (
  <>
    <div
      css={[tw`relative`]}
      style={{
        aspectRatio: `${
          !section.image.aspectRatio ? "16/9" : section.image.aspectRatio
        }`,
      }}
    >
      <StorageImage image={section.image.storageImage} />
    </div>
    {section.caption ? <$Caption>{section.caption}</$Caption> : null}
  </>
)

export const $VideoSection_ = ({ section }: { section: VideoSection }) => (
  <div>
    {/*  eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
    <Video_ youtubeId={section.youtubeId!} />
    {section.caption ? <$Caption>{section.caption}</$Caption> : null}
  </div>
)
