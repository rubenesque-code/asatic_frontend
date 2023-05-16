/* eslint-disable @next/next/no-img-element */
import { ReactElement } from "react"
import tw from "twin.macro"
import { PlayIcon } from "^components/Icons"
import StorageImage from "^components/StorageImage"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"
import { getYoutubeThumbnailFromId } from "^helpers/youtube"

const PlayIconOverlay = () => (
  <span css={[tw`absolute text-5xl right-sm bottom-sm`]}>
    <PlayIcon weight="fill" color="rgba(229, 231, 235, 0.8)" />
  </span>
)

const ImageContainer = ({ children: image }: { children: ReactElement }) => (
  <div css={[tw`relative aspect-ratio[16 / 9] w-full mb-xs flex-grow`]}>
    {image}
    <PlayIconOverlay />
  </div>
)

export const SummaryImage_ = ({
  image,
  youtubeId,
}: {
  image: RecordedEventAsSummary["summaryImage"]
  youtubeId: string
}) => {
  return (
    <ImageContainer>
      {image ? (
        <StorageImage
          image={image.storageImage}
          vertPosition={image.vertPosition}
        />
      ) : (
        <img
          css={[tw`absolute w-full h-full object-cover `]}
          src={getYoutubeThumbnailFromId(youtubeId)}
          style={{ objectPosition: `50% 50%` }}
          alt=""
        />
      )}
    </ImageContainer>
  )
}
