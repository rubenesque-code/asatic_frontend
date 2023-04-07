import { ContainerWidth } from "^components/ContainerUtility"
import { getYoutubeEmbedUrlFromId } from "^helpers/youtube"

export const Video_ = ({ youtubeId }: { youtubeId: string }) => {
  const url = getYoutubeEmbedUrlFromId(youtubeId)
  const optionParams = "?modestbranding=1&color=white&frameborder=0"

  return (
    <ContainerWidth>
      {(width) => (
        <VideoIFrame
          height={(width * 9) / 16}
          src={url + optionParams}
          width={width}
        />
      )}
    </ContainerWidth>
  )
}

const VideoIFrame = ({
  height,
  src,
  width,
}: {
  width: number
  height: number
  src: string
}) => {
  return (
    <iframe
      width={width}
      height={height}
      src={src}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
