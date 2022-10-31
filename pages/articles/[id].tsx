import type { NextPage } from 'next'
import tw from 'twin.macro'

import FirestoreImage from '^components/FirestoreImage'

import { StaticData } from '^components/pages/document/article/staticData'
export {
  getStaticPaths,
  getStaticProps,
} from '^components/pages/document/article/staticData'

const ArticlePage: NextPage<StaticData> = (props) => {
  return (
    <div>
      Article
      <div css={[tw`relative aspect-ratio[16 / 9]`]}>
        <FirestoreImage image={props.images[0]} />
      </div>
    </div>
  )
}

export default ArticlePage
