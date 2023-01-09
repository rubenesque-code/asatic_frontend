import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Swiper_ } from "^page-container"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import Collection from "./child-summaries/Collection"
import { $SectionContent, $SectionHeader } from "./_styles"

const Collections = ({
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
      <$SectionHeader>Collections</$SectionHeader>
      <$SectionContent>
        <Swiper_
          colorTheme="white"
          slides={orderedCollections.map((collection, i) => (
            <Collection
              collection={collection}
              parentCurrentLanguageId={parentCurrentLanguageId}
              index={i}
              key={collection.id}
            />
          ))}
        />
      </$SectionContent>
    </div>
  )
}

export default Collections
