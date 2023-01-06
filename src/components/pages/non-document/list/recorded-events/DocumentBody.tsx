import { StaticData } from "./staticData"
import Summary from "./Summary"

import { DocumentBody_, useProcessEntities } from "../_containers"

const DocumentBody = ({
  recordedEvents,
  sortLanguageId,
}: {
  recordedEvents: StaticData["recordedEvents"]["recordedEvents"]
  sortLanguageId: string | null
}) => {
  const processedRecordedEvents = useProcessEntities({
    entities: recordedEvents,
    sortLanguageId: sortLanguageId,
  })

  return (
    <DocumentBody_
      entities={processedRecordedEvents.map((recordedEvent) => (
        <Summary
          recordedEvent={recordedEvent}
          sortLanguageId={sortLanguageId}
          key={recordedEvent.id}
        />
      ))}
    />
  )
}

export default DocumentBody
