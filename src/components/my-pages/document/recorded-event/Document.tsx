import tw from "twin.macro"

import { StaticData } from "./staticData"

import { Languages_ } from "^components/my-pages/_containers"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { findTranslationByLanguageId } from "^helpers/data"
import { Authors_ } from "../_containers"
import { Video_ } from "../_containers"
import { $CenterMaxWidth_ } from "^components/my-pages/_presentation"
import Prose_ from "../_containers/Prose_"
import { $DocumentMaxWidthContainer } from "../_presentation"

const $DocumentHeader = tw.div`sm:pb-xs`

const $Type = tw.h2`text-sm sm:text-base uppercase text-gray-700 mb-xxs sm:mb-xs`

const $Title = tw.h1`text-3xl sm:text-4xl text-gray-900`

const $authors = tw`flex gap-xs text-xl sm:text-2xl text-gray-600 mt-xxs sm:mt-xs line-height[1.5em] `

const $DocumentBody = tw.div`py-sm sm:py-md`

const $bodyText = tw`py-sm sm:py-md border-l pl-sm sm:pl-md`

const $textSectionPadding = tw`px-sm sm:px-md`

const Document = ({
  pageData: { authors, languages, recordedEvent },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { documentLanguage } = useDetermineDocumentLanguage(languages)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = findTranslationByLanguageId(
    recordedEvent.translations,
    documentLanguage.id
  )!

  return (
    <div
      css={[
        tw`mt-xl`,
        documentLanguage.id === "tamil"
          ? tw`font-serif-primary-tamil`
          : tw`font-serif-primary`,
      ]}
    >
      <div css={[tw``]}>
        <$DocumentMaxWidthContainer styles={tw`px-sm`}>
          <$DocumentHeader>
            <$Type>
              <Type_
                parentRecordedEventLanguageId={translation.languageId}
                recordedEventType={recordedEvent.recordedEventType}
              />
            </$Type>
            <$Title>{translation.title}</$Title>
            <Authors_
              authors={authors}
              documentLanguageId={documentLanguage.id}
              styles={$authors}
            />
            <Languages_
              documentLanguage={documentLanguage}
              documentLanguages={languages}
              styles={tw`mt-md`}
            />
          </$DocumentHeader>
        </$DocumentMaxWidthContainer>
        <$DocumentBody>
          <$CenterMaxWidth_
            maxWidth={tw`max-w-[1000px]`}
            styles={tw`border-t border-b py-md px-xxs`}
          >
            <Video_ youtubeId={recordedEvent.youtubeId} />
          </$CenterMaxWidth_>
          {translation.body?.length ? (
            <$DocumentMaxWidthContainer styles={$textSectionPadding}>
              <Prose_ htmlStr={translation.body} styles={$bodyText} />
            </$DocumentMaxWidthContainer>
          ) : null}
        </$DocumentBody>
      </div>
    </div>
  )
}

export default Document

const Type_ = ({
  recordedEventType,
  parentRecordedEventLanguageId,
}: {
  recordedEventType: StaticData["pageData"]["recordedEvent"]["recordedEventType"]
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
