import produce from "immer"
import {
  filterValidAuthorsAsChildren,
  filterValidCollections,
  filterValidTags,
  getArticleLikeDocumentImageIds,
} from "^helpers/process-fetched-data"
import { validateRecordedEventTypeAsChild } from "^helpers/process-fetched-data/recordedEventType"
import {
  fetchAuthors,
  fetchCollections,
  fetchImages,
  fetchRecordedEventType,
  fetchSubjects,
  fetchTags,
} from "^lib/firebase/firestore"
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

type PageEntity =
  | SanitisedArticle
  | SanitisedBlog
  | SanitisedCollection
  | SanitisedRecordedEvent

type FetchedChildren = {
  authors?: Author[]
  collections?: SanitisedCollection[]
  subjects?: SanitisedSubject[]
  tags?: Tag[]
  recordedEventType?: RecordedEventType
  images?: Image[]
  image?: Image
}

export async function fetchChildren<TEntity extends PageEntity>(
  entity: TEntity
) {
  const obj: FetchedChildren = {}

  if (
    entity.type === "article" ||
    entity.type === "blog" ||
    entity.type === "recordedEvent"
  ) {
    obj.authors = !entity.authorsIds.length
      ? []
      : await fetchAuthors(entity.authorsIds)

    obj.collections = !entity.collectionsIds.length
      ? []
      : await fetchCollections(entity.collectionsIds)

    obj.subjects = !entity.subjectsIds.length
      ? []
      : await fetchSubjects(entity.subjectsIds)
    obj.tags = !entity.tagsIds.length ? [] : await fetchTags(entity.tagsIds)
  }
  if (entity.type === "article" || entity.type === "blog") {
    const images = getArticleLikeDocumentImageIds(entity.translations)
    obj.images = !images.length ? [] : await fetchImages(images)
  }
  if (entity.type === "recordedEvent") {
    obj.recordedEventType = !entity.recordedEventTypeId
      ? undefined
      : await fetchRecordedEventType(entity.recordedEventTypeId)
  }

  type FetchedChildrenUnionSubSet<
    TFetchedChildren extends keyof FetchedChildren
  > = TFetchedChildren

  type FetchedFields<TEntityType extends TEntity["type"]> =
    TEntityType extends "recordedEvent"
      ? FetchedChildrenUnionSubSet<
          "authors" | "subjects" | "collections" | "tags" | "recordedEventType"
        >
      : FetchedChildrenUnionSubSet<
          "authors" | "collections" | "subjects" | "tags" | "images"
        >

  return obj as Required<Pick<FetchedChildren, FetchedFields<TEntity["type"]>>>
}

type ValidateChildrenArgs = {
  authors: Author[]
  collections: SanitisedCollection[]
  subjects: SanitisedSubject[]
  tags: Tag[]
  recordedEventType: RecordedEventType | undefined | null
  images: Image[]
  image: Image
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
  })

  return validated
}

// const a = validateChildren({authors: [], collections: []})
