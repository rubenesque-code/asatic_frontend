import NextImage, { ImageProps } from 'next/image'

import { Image } from '^types/image'

type FirestoreImageProps = {
  image: Image
  layout?: ImageProps['layout']
  objectFit?: ImageProps['objectFit']
  vertPosition?: number
}

const FirestoreImage = ({
  image,
  layout = 'fill',
  objectFit = 'cover',
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

export default FirestoreImage
