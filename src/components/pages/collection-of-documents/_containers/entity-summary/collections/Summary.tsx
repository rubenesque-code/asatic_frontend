/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
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
  parentCurrentLanguageId,
  index,
}: {
  collection: CollectionAsSummary
  parentCurrentLanguageId: string
  index: number
}) => {
  const translation = determineChildTranslation(
    collection.translations,
    parentCurrentLanguageId
  )

  return (
    <$SwiperSlideContainer index={index}>
      <$SummaryImage image={collection.summaryImage!} styles={tw`mb-xs`} />
      <EntityLink_
        entityId={collection.id}
        documentLanguageId={translation.languageId}
        routeKey="recordedEvents"
      >
        <$Title>{translation.title}</$Title>
      </EntityLink_>
      <$SummaryText
        htmlStr={translation.summaryText!}
        languageId={translation.languageId}
        maxCharacters={200}
      />
    </$SwiperSlideContainer>
  )
}

export default Collection
