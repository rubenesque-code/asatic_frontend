import NextImage, { ImageProps } from "next/image"

import { Image } from "^types/entities/image"

type FirestoreImageProps = {
  image: Image
  layout?: ImageProps["layout"]
  objectFit?: ImageProps["objectFit"]
  vertPosition?: number
}

const StorageImage = ({
  image,
  layout = "fill",
  objectFit = "cover",
  vertPosition,
}: FirestoreImageProps) => {
  const position = `50% ${vertPosition}%`

  return (
    <NextImage
      src={image.URL}
      placeholder="blur"
      blurDataURL={image.blurURL}
      layout={layout}
      objectFit={objectFit}
      objectPosition={position}
    />
  )
}

export default StorageImage
