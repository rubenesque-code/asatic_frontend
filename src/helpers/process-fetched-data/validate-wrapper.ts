import produce from "immer"
import { filterValidAuthorsAsChildren } from "^helpers/process-fetched-data/author"
import {
  Author,
  Image,
  RecordedEventType,
  SanitisedArticle,
  SanitisedBlog,
  SanitisedCollection,
  SanitisedRecordedEvent,
  SanitisedSubject,
  Tag,
} from "^types/entities"
import { filterValidArticleLikeEntities } from "./article-like"
import { filterValidCollections } from "./collection/validate"
import { validateRecordedEventTypeAsChild } from "./recorded-event-type/validate"
import { filterValidRecordedEvents } from "./recorded-event/validate"
import { filterValidTags } from "./tag"

type ValidateChildrenArgs = {
  authors: Author[]
  collections: SanitisedCollection[]
  subjects: SanitisedSubject[]
  tags: Tag[]
  recordedEventType: RecordedEventType | undefined | null
  images: Image[]
  image: Image
  articles: SanitisedArticle[]
  blogs: SanitisedBlog[]
  recordedEvents: SanitisedRecordedEvent[]
}

export function validateChildren<
  TChildren extends Partial<ValidateChildrenArgs>
>(args: TChildren, validLanguageIds: string[]): TChildren {
  const validated = produce(args, (draft) => {
    if (draft.authors) {
      draft.authors = filterValidAuthorsAsChildren(
        draft.authors,
        validLanguageIds
      )
    }
    if (draft.collections) {
      draft.collections = filterValidCollections(
        draft.collections,
        validLanguageIds
      )
    }
    if (draft.tags) {
      draft.tags = filterValidTags(draft.tags)
    }
    if (draft.recordedEventType) {
      draft.recordedEventType = validateRecordedEventTypeAsChild(
        draft.recordedEventType,
        validLanguageIds
      )
        ? draft.recordedEventType
        : null
    }
    if (draft.articles) {
      draft.articles = filterValidArticleLikeEntities(
        draft.articles,
        validLanguageIds
      )
    }
    if (draft.blogs) {
      draft.blogs = filterValidArticleLikeEntities(
        draft.blogs,
        validLanguageIds
      )
    }
    if (draft.recordedEvents) {
      draft.recordedEvents = filterValidRecordedEvents(
        draft.recordedEvents,
        validLanguageIds
      )
    }
  })

  return validated
}

// const a = validateChildren({authors: [], collections: []})
