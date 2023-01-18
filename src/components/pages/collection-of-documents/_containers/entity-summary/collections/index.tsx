import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { CollectionAsSummary } from "^helpers/process-fetched-data/collection/process"

import { Swiper_ } from "^page-container"
import Summary from "./Summary"
import { $SwiperSectionLayout } from "../_presentation/$SwiperSectionLayout"

const Collections = ({
  collections,
  parentCurrentLanguageId,
}: {
  collections: CollectionAsSummary[] | null
  parentCurrentLanguageId: string
}) => {
  if (!collections?.length) {
    return null
  }

  const orderedCollections = sortEntitiesByDate(collections)

  return (
    <$SwiperSectionLayout
      swiper={
        <Swiper_
          slides={orderedCollections.map((collection, i) => (
            <Summary
              collection={collection}
              parentCurrentLanguageId={parentCurrentLanguageId}
              index={i}
              key={collection.id}
            />
          ))}
        />
      }
      title="Collections"
    />
  )
}

export default Collections
