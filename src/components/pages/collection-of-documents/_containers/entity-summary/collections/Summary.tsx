/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"

import { CollectionAsSummary } from "^helpers/process-fetched-data/collection/process"

import { EntityLink_ } from "^entity-summary/_containers"
import { $SummaryImage, $SummaryText } from "^entity-summary/_presentation"
import { $Title } from "^entity-summary/_styles/$swiper-summary"

const Collection = ({
  collection,
  maxCharacters = 150,
}: {
  collection: CollectionAsSummary
  maxCharacters?: number
}) => {
  return (
    <>
      <$SummaryImage image={collection.summaryImage!} styles={tw`mb-xs`} />
      <EntityLink_
        entityId={collection.id}
        documentLanguageId={collection.languageId}
        routeKey="collections"
      >
        <$Title>{collection.title}</$Title>
      </EntityLink_>
      {collection.text ? (
        <$SummaryText
          htmlStr={collection.text}
          languageId={collection.languageId}
          maxCharacters={maxCharacters}
        />
      ) : null}
    </>
  )
}

export default Collection
