import {
  fetchArticles,
  fetchAuthors,
  fetchBlogs,
  fetchCollections,
  fetchImages,
  fetchRecordedEvents,
  fetchRecordedEventType,
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

import { getArticleLikeDocumentImageIds } from "./process-fetched-data/article-like"

type PageEntity =
  | SanitisedArticle
  | SanitisedBlog
  | SanitisedCollection
  | SanitisedRecordedEvent
  | SanitisedSubject

type FetchedChildren = {
  authors?: Author[]
  collections?: SanitisedCollection[]
  tags?: Tag[]
  recordedEventType?: RecordedEventType
  images?: Image[]
  image?: Image
  articles?: SanitisedArticle[]
  blogs?: SanitisedBlog[]
  recordedEvents?: SanitisedRecordedEvent[]
}
export async function fetchChildren<TEntity extends PageEntity>(
  entity: TEntity
) {
  const obj: FetchedChildren = {}

  if (
    entity.type === "article" ||
    entity.type === "blog" ||
    entity.type === "collection" ||
    entity.type === "recordedEvent" ||
    entity.type === "subject"
  ) {
    obj.tags = !entity.tagsIds.length ? [] : await fetchTags(entity.tagsIds)
  }
  if (
    entity.type === "article" ||
    entity.type === "blog" ||
    entity.type === "recordedEvent" ||
    entity.type === "subject"
  ) {
    obj.collections = !entity.collectionsIds.length
      ? []
      : await fetchCollections(entity.collectionsIds)
  }
  if (
    entity.type === "article" ||
    entity.type === "blog" ||
    entity.type === "recordedEvent"
  ) {
    obj.authors = !entity.authorsIds.length
      ? []
      : await fetchAuthors(entity.authorsIds)
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
  if (entity.type === "subject" || entity.type === "collection") {
    obj.articles = !entity.articlesIds.length
      ? []
      : await fetchArticles(entity.articlesIds)
    obj.blogs = !entity.blogsIds.length ? [] : await fetchBlogs(entity.blogsIds)
    obj.recordedEvents = !entity.recordedEventsIds.length
      ? []
      : await fetchRecordedEvents(entity.recordedEventsIds)

    // □ Should handle fetching child images here? WHy not...
    // const articlesImages = []
  }

  type FetchedChildrenUnionSubSet<
    TFetchedChildren extends keyof FetchedChildren
  > = TFetchedChildren

  type FetchedFields<TEntityType extends TEntity["type"]> =
    TEntityType extends "recordedEvent"
      ? FetchedChildrenUnionSubSet<
          "authors" | "collections" | "tags" | "recordedEventType"
        >
      : TEntityType extends "article"
      ? FetchedChildrenUnionSubSet<
          "authors" | "collections" | "tags" | "images"
        >
      : TEntityType extends "blog"
      ? FetchedChildrenUnionSubSet<
          "authors" | "collections" | "tags" | "images"
        >
      : TEntityType extends "subject"
      ? FetchedChildrenUnionSubSet<
          "tags" | "collections" | "articles" | "blogs" | "recordedEvents"
        >
      : FetchedChildrenUnionSubSet<
          "tags" | "articles" | "blogs" | "recordedEvents"
        >

  return obj as Required<Pick<FetchedChildren, FetchedFields<TEntity["type"]>>>
}
