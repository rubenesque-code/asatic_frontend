import { ContainerWidth } from '^components/ContainerUtility'
import { getYoutubeEmbedUrlFromId } from '^helpers/youtube'

const Video_ = ({ youtubeId }: { youtubeId: string }) => {
  const url = getYoutubeEmbedUrlFromId(youtubeId)

  return (
    <ContainerWidth>
      {(width) => (
        <VideoIFrame height={(width * 9) / 16} src={url} width={width} />
      )}
    </ContainerWidth>
  )
}

export default Video_

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
      frameBorder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
