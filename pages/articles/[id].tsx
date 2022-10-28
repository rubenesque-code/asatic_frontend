import type { NextPage } from 'next'
import tw from 'twin.macro'
import FirestoreImage from '^components/FirestoreImage'

import { StaticData } from '^components/pages/document/article/staticData'
export {
  getStaticPaths,
  getStaticProps,
} from '^components/pages/document/article/staticData'

const ArticlePage = ({ data }: { data: StaticData }) => {
  console.log('data:', data)
  // const image = data.data.images[0]
  // console.log('image:', image)

  return (
    <div>
      Article
      <div css={[tw`aspect-ratio[16 / 9]`]}>
        {/* <FirestoreImage image={image} /> */}
      </div>
    </div>
  )
}

export default ArticlePage
