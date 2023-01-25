import { sortEntitiesByDate } from "^helpers/manipulateEntity"
import { CollectionAsSummary } from "^helpers/process-fetched-data/collection/process"

import { Swiper_ } from "^page-container"
import Summary from "./Summary"
import { $SwiperSectionLayout } from "../_presentation/$SwiperSectionLayout"
import { siteTranslations } from "^constants/siteTranslations"
import { SiteLanguageId } from "^constants/languages"
import { $SwiperSlideContainer } from "^entity-summary/_presentation"

const Collections = ({
  collections,
  showSeeAllElement,
  parentCurrentLanguageId,
}: {
  collections: CollectionAsSummary[] | null
  showSeeAllElement?: boolean
  parentCurrentLanguageId: string
}) => {
  if (!collections?.length) {
    return null
  }

  const orderedCollections = sortEntitiesByDate(collections)

  const languageId: SiteLanguageId =
    parentCurrentLanguageId === "tamil" ? "tamil" : "english"

  return (
    <$SwiperSectionLayout
      swiper={
        <Swiper_
          slides={({ numSlidesPerView }) =>
            orderedCollections.map((collection, i) => (
              <$SwiperSlideContainer
                index={i}
                rightBorder={
                  orderedCollections.length < numSlidesPerView &&
                  i === orderedCollections.length - 1
                }
                key={collection.id}
              >
                <Summary collection={collection} />
              </$SwiperSlideContainer>
            ))
          }
        />
      }
      title={siteTranslations.collections[languageId]}
      seeAllText={
        showSeeAllElement
          ? `${siteTranslations.more[languageId]} ${siteTranslations.collections[languageId]}`
          : undefined
      }
      routeKey="collections"
      parentCurrentLanguageId={parentCurrentLanguageId}
    />
  )
}

export default Collections
