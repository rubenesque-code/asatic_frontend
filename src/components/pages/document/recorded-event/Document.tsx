import tw from "twin.macro"

import { StaticData } from "./staticData"

import HtmlStrToJSX from "^components/HtmlStrToJSX"
import { Languages_ } from "^components/pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { findEntityByLanguageId } from "^helpers/data"
import { Authors_ } from "../_containers"
import { RecordedEventType } from "^types/entities"
import { Video_ } from "../_containers"

const $DocumentHeader = tw.div`pb-md border-b`

const $Type = tw.h2`text-lg uppercase text-gray-700 mb-xs`

const $Title = tw.h1`text-3xl text-gray-900 line-height[1.5em]`

const $authors = tw`flex gap-xs text-2xl text-gray-600 mt-xs line-height[1.5em] `

const $DocumentBody = tw.div`py-md border-b`

const $BodyText = tw.div`py-sm prose prose-lg`

const Document = (recordedEvent: StaticData["recordedEvent"]) => {
  const { documentLanguage } = useDetermineDocumentLanguage(
    recordedEvent.languages
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = findEntityByLanguageId(
    recordedEvent.translations,
    documentLanguage.id
  )!

  return (
    <>
      <$DocumentHeader>
        <Languages_
          documentLanguage={documentLanguage}
          documentLanguages={recordedEvent.languages}
        />
        <$Type>
          <Type_
            parentRecordedEventLanguageId={translation.languageId}
            recordedEventType={recordedEvent.recordedEventType}
          />
        </$Type>
        <$Title>{translation.title}</$Title>
        <Authors_
          authors={recordedEvent.authors}
          documentLanguageId={documentLanguage.id}
          styles={$authors}
        />
      </$DocumentHeader>
      <$DocumentBody>
        <Video_ youtubeId={recordedEvent.youtubeId} />
        {translation.body?.length ? (
          <$BodyText className="custom-prose">
            <HtmlStrToJSX text={translation.body} />
          </$BodyText>
        ) : null}
      </$DocumentBody>
    </>
  )
}

export default Document

const Type_ = ({
  recordedEventType,
  parentRecordedEventLanguageId,
}: {
  recordedEventType: RecordedEventType | undefined | null
  parentRecordedEventLanguageId: string
}) => {
  if (!recordedEventType) {
    return null
  }

  const translation = recordedEventType.translations.find(
    (translation) => translation.languageId === parentRecordedEventLanguageId
  )

  if (!translation) {
    return null
  }

  return <>{translation.name}</>
}
