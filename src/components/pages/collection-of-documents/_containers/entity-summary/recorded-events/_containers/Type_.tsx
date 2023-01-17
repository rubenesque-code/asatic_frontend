import tw from "twin.macro"
import { findTranslationByLanguageId } from "^helpers/data"
import { RecordedEventAsSummary } from "^helpers/process-fetched-data/recorded-event/process"

export const Type_ = ({
  type,
  parentLanguageId,
}: {
  type: RecordedEventAsSummary["recordedEventType"]
  parentLanguageId: string
}) => {
  if (!type) {
    return null
  }

  const translation = findTranslationByLanguageId(
    type.translations,
    parentLanguageId
  )

  if (!translation?.name) {
    return null
  }

  return (
    <h4 css={[tw`uppercase tracking-wider text-sm`]}>{translation.name}</h4>
  )
}
