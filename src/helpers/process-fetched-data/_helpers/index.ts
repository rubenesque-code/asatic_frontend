import { DocumentEntitiesAsSummaries } from "../_types"

export function sortEntitiesByDate(entities: DocumentEntitiesAsSummaries) {
  return entities.sort((a, b) => {
    return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
  })
}

export function unshiftFirstEntityWithImage(
  entities: DocumentEntitiesAsSummaries
) {
  const hasStorageImageIndex = entities.findIndex(
    (entity) => entity.summaryImage?.storageImage
  )

  if (hasStorageImageIndex > -1) {
    const removed = entities.splice(hasStorageImageIndex, 1)
    const newArr = [...removed, ...entities]

    return newArr
  }

  const recordedEventIndex = entities.findIndex(
    (entity) => entity.type === "recordedEvent"
  )

  if (recordedEventIndex > -1) {
    const removed = entities.splice(recordedEventIndex, 1)
    return [...removed, ...entities]
  }

  return entities
}
