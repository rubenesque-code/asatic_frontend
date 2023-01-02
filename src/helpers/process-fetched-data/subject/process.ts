import produce from "immer"
import {
  Image,
  RecordedEventType,
  SanitisedArticle,
  SanitisedBlog,
  SanitisedRecordedEvent,
  SanitisedSubject,
} from "^types/entities"
import { MakeRequired } from "^types/utilities"
import { validateTranslation } from "./validate"
import { processArticleLikeEntityAsSummary } from "../article-like"
import { processRecordedEventAsSummary } from "../recorded-event/process"

type ProcessedTranslation = MakeRequired<
  SanitisedSubject["translations"][number],
  "title"
>

/** Invoked after validation so has required fields. */
export function processSubjectForOwnPage({
  subject,
  validLanguageIds,
  validImages,
  validChildren,
  validAuthorIds,
  validRecordedEventTypes,
}: {
  subject: SanitisedSubject
  validLanguageIds: string[]
  validImages: Image[]
  validAuthorIds: string[]
  validRecordedEventTypes: RecordedEventType[]
  validChildren: {
    articles: SanitisedArticle[]
    blogs: SanitisedBlog[]
    recordedEvents: SanitisedRecordedEvent[]
  }
}) {
  // remove invalid translations; remove empty translation sections.
  const processedTranslations = produce(subject.translations, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const translation = draft[i]

      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        draft.splice(i, 1)
        break
      }
    }
  }) as ProcessedTranslation[]

  const childEntities = {
    articles: validChildren.articles.map((article) =>
      processArticleLikeEntityAsSummary({
        entity: article,
        validImages,
        validLanguageIds,
        validAuthorIds,
      })
    ),
    blogs: validChildren.blogs.map((blog) =>
      processArticleLikeEntityAsSummary({
        entity: blog,
        validImages,
        validLanguageIds,
        validAuthorIds,
      })
    ),
    recordedEvents: validChildren.recordedEvents.map((recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        validAuthorIds,
        validImages,
        validLanguageIds,
        validRecordedEventTypes,
      })
    ),
  }

  return {
    id: subject.id,
    publishDate: subject.publishDate,
    translations: processedTranslations,
    ...childEntities,
  }
}
