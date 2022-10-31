import { firestore_collection_key } from '^constants/firestoreCollections'
import {
  UnsanitizedFirestoreDocument,
  sanitiseNonSerializableDoc,
  sanitiseNonSerializableCollection,
} from '^helpers/firestore'
import {
  Article,
  Author,
  Blog,
  Collection,
  Image,
  LandingSection,
  Language,
  RecordedEvent,
  RecordedEventType,
  Subject,
  Tag,
} from '^types/index'

import {
  fetchFirestoreDocument,
  fetchFirestoreCollection,
  fetchFirestoreDocuments,
  fetchFirestorePublishableCollection,
  fetchFirestorePublishableDocuments,
} from './helpers'

export const fetchArticle = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    firestore_collection_key.articles,
    docId
  )) as UnsanitizedFirestoreDocument<Article>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as Article

  return sanitised
}

export const fetchArticles = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestorePublishableDocuments('articles', ids)
      : await fetchFirestorePublishableCollection(
          firestore_collection_key.articles
        )
  ) as UnsanitizedFirestoreDocument<Article>[]

  const sanitised = sanitiseNonSerializableCollection(
    firestoreDocs
  ) as Article[]

  return sanitised
}

export const fetchAuthors = async (ids: string[]) =>
  (await fetchFirestoreDocuments('authors', ids)) as Author[]

export const fetchBlog = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    firestore_collection_key.blogs,
    docId
  )) as UnsanitizedFirestoreDocument<Blog>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as Blog

  return sanitised
}

export const fetchBlogs = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestoreDocuments('blogs', ids)
      : await fetchFirestoreCollection(firestore_collection_key.blogs)
  ) as UnsanitizedFirestoreDocument<Blog>[]

  const sanitised = sanitiseNonSerializableCollection(firestoreDocs) as Blog[]

  return sanitised
}

export const fetchCollection = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    firestore_collection_key.collections,
    docId
  )) as UnsanitizedFirestoreDocument<Collection>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as Collection

  return sanitised
}
export const fetchCollections = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestoreDocuments('collections', ids)
      : await fetchFirestoreCollection(firestore_collection_key.collections)
  ) as UnsanitizedFirestoreDocument<Collection>[]

  const sanitised = sanitiseNonSerializableCollection(
    firestoreDocs
  ) as Collection[]

  return sanitised
}

export const fetchLanguages = async (ids: string[]) =>
  (await fetchFirestoreDocuments(
    firestore_collection_key.languages,
    ids
  )) as Language[]

export const fetchTags = async (ids: string[]) =>
  (await fetchFirestoreDocuments(firestore_collection_key.tags, ids)) as Tag[]

export const fetchImages = async (ids: string[]) =>
  (await fetchFirestoreDocuments(
    firestore_collection_key.images,
    ids
  )) as Image[]

export const fetchLanding = async () =>
  (await fetchFirestoreCollection(
    firestore_collection_key.landing
  )) as LandingSection[]

export const fetchRecordedEvent = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    firestore_collection_key.recordedevents,
    docId
  )) as UnsanitizedFirestoreDocument<RecordedEvent>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as RecordedEvent

  return sanitised
}
export const fetchRecordedEvents = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestoreDocuments('recordedEvents', ids)
      : await fetchFirestoreCollection(firestore_collection_key.recordedevents)
  ) as UnsanitizedFirestoreDocument<RecordedEvent>[]

  const sanitised = sanitiseNonSerializableCollection(
    firestoreDocs
  ) as RecordedEvent[]

  return sanitised
}

export const fetchRecordedEventTypes = async () =>
  (await fetchFirestoreCollection(
    firestore_collection_key.recordedeventtypes
  )) as RecordedEventType[]

export const fetchSubjects = async (ids: string[]) =>
  (await fetchFirestoreDocuments(
    firestore_collection_key.subjects,
    ids
  )) as Subject[]
