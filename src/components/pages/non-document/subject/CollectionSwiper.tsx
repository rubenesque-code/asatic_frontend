import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Swiper_ } from "^page-container"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import Collection from "./child-summaries/Collection"

const CollectionSwiper = ({
  collections,
  parentCurrentLanguageId,
}: {
  collections: StaticData["subject"]["collections"]
  parentCurrentLanguageId: string
}) => {
  if (!collections.length) {
    return null
  }

  const orderedCollections = sortEntitiesByDate(collections)

  return (
    <div css={[tw`border-b`]}>
      <div
        css={[
          tw`text-2xl text-gray-700 mb-sm border-b pl-xs pb-sm pt-md border-t`,
        ]}
      >
        Collections
      </div>
      <Swiper_
        colorTheme="white"
        slides={orderedCollections.map((collection) => (
          <Collection
            collection={collection}
            parentCurrentLanguageId={parentCurrentLanguageId}
            key={collection.id}
          />
        ))}
      />
    </div>
  )
}

export default CollectionSwiper
