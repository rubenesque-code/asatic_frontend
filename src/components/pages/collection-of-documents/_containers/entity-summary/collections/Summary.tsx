/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"

import { CollectionAsSummary } from "^helpers/process-fetched-data/collection/process"

import { EntityLink_ } from "^entity-summary/_containers"
import {
  $SwiperSlideContainer,
  $SummaryImage,
  $SummaryText,
} from "^entity-summary/_presentation"
import { $Title } from "^entity-summary/_styles/$swiper-summary"

const Collection = ({
  collection,
  index,
  rightBorder,
}: {
  collection: CollectionAsSummary
  index: number
  rightBorder: boolean
}) => {
  return (
    <$SwiperSlideContainer index={index} rightBorder={rightBorder}>
      <$SummaryImage image={collection.summaryImage!} styles={tw`mb-xs`} />
      <EntityLink_
        entityId={collection.id}
        documentLanguageId={collection.languageId}
        routeKey="recordedEvents"
      >
        <$Title>{collection.title}</$Title>
      </EntityLink_>
      {collection.text ? (
        <$SummaryText
          htmlStr={collection.text}
          languageId={collection.languageId}
          maxCharacters={150}
        />
      ) : null}
    </$SwiperSlideContainer>
  )
}

export default Collection
