import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_ } from "^components/pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { findEntityByLanguageId } from "^helpers/data"
import { Authors_ } from "../_containers"
import { RecordedEventType } from "^types/entities"
import { Video_ } from "../_containers"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { $textSectionMaxWidth } from "^styles/global"
import Prose_ from "../_containers/Prose_"

const $DocumentHeader = tw.div`sm:pb-xs`

const $Type = tw.h2`text-sm sm:text-base uppercase text-gray-700 mb-xxs sm:mb-xs`

const $Title = tw.h1`text-3xl sm:text-4xl text-gray-900`

const $authors = tw`flex gap-xs text-xl sm:text-2xl text-gray-600 mt-xxs sm:mt-xs line-height[1.5em] `

const $DocumentBody = tw.div`py-sm sm:py-md`

const $bodyText = tw`py-sm sm:py-md border-l pl-sm sm:pl-md`

const $textSectionPadding = tw`px-sm sm:px-md`

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
      <$CenterMaxWidth_
        maxWidth={$textSectionMaxWidth}
        styles={$textSectionPadding}
      >
        <$DocumentHeader>
          <div css={[tw`mb-md`]}>
            <Languages_
              documentLanguage={documentLanguage}
              documentLanguages={recordedEvent.languages}
            />
          </div>
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
      </$CenterMaxWidth_>
      <$DocumentBody>
        <$CenterMaxWidth_
          maxWidth={tw`max-w-[1000px]`}
          styles={tw`border-t border-b py-md px-xxs`}
        >
          <Video_ youtubeId={recordedEvent.youtubeId} />
        </$CenterMaxWidth_>
        {translation.body?.length ? (
          <$CenterMaxWidth_
            maxWidth={$textSectionMaxWidth}
            styles={$textSectionPadding}
          >
            <Prose_ htmlStr={translation.body} styles={$bodyText} />
          </$CenterMaxWidth_>
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
