import { firestore_collection_key } from "^constants/firestoreCollections"
import {
  UnsanitizedFirestoreDocument,
  sanitiseNonSerializableDoc,
  sanitiseNonSerializableCollection,
} from "^helpers/firestore"
import {
  Article,
  Author,
  Blog,
  Collection,
  FetchedArticle,
  FetchedSubject,
  Image,
  LandingSection,
  Language,
  RecordedEvent,
  RecordedEventType,
  SanitisedArticle,
  SanitisedSubject,
  Tag,
} from "^types/entities"

import {
  fetchFirestoreDocument,
  fetchFirestoreCollection,
  fetchFirestoreDocuments,
  fetchFirestorePublishableCollection,
  fetchFirestorePublishableDocuments,
} from "./helpers"

// have to 'sanitise' data (handle firestore timestamps) before pass to Next component else get an error.

export const fetchArticle = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    firestore_collection_key.articles,
    docId
  )) as UnsanitizedFirestoreDocument<FetchedArticle>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as SanitisedArticle

  return sanitised
}

export const fetchArticles = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestorePublishableDocuments("articles", ids)
      : await fetchFirestorePublishableCollection("articles")
  ) as UnsanitizedFirestoreDocument<Article>[]

  const sanitised = sanitiseNonSerializableCollection(
    firestoreDocs
  ) as SanitisedArticle[]

  return sanitised
}

export const fetchAuthors = async (ids: string[]) =>
  (await fetchFirestoreDocuments("authors", ids)) as Author[]

export const fetchBlog = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    "blogs",
    docId
  )) as UnsanitizedFirestoreDocument<Blog>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as Blog

  return sanitised
}

export const fetchBlogs = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestoreDocuments("blogs", ids)
      : await fetchFirestoreCollection(firestore_collection_key.blogs)
  ) as UnsanitizedFirestoreDocument<Blog>[]

  const sanitised = sanitiseNonSerializableCollection(firestoreDocs) as Blog[]

  return sanitised
}

export const fetchCollection = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    "collections",
    docId
  )) as UnsanitizedFirestoreDocument<Collection>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as Collection

  return sanitised
}
export const fetchCollections = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestoreDocuments("collections", ids)
      : await fetchFirestoreCollection("collections")
  ) as UnsanitizedFirestoreDocument<Collection>[]

  const sanitised = sanitiseNonSerializableCollection(
    firestoreDocs
  ) as Collection[]

  return sanitised
}

export const fetchImages = async (ids: string[]) =>
  (await fetchFirestoreDocuments("images", ids)) as Image[]

export const fetchLanguages = async (ids: string[]) =>
  (await fetchFirestoreDocuments(
    firestore_collection_key.languages,
    ids
  )) as Language[]

export const fetchLanding = async () =>
  (await fetchFirestoreCollection("landing")) as LandingSection[]

export const fetchRecordedEvent = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    "recordedEvents",
    docId
  )) as UnsanitizedFirestoreDocument<RecordedEvent>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as RecordedEvent

  return sanitised
}
export const fetchRecordedEvents = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestoreDocuments("recordedEvents", ids)
      : await fetchFirestoreCollection("recordedEvents")
  ) as UnsanitizedFirestoreDocument<RecordedEvent>[]

  const sanitised = sanitiseNonSerializableCollection(
    firestoreDocs
  ) as RecordedEvent[]

  return sanitised
}

export const fetchRecordedEventTypes = async () =>
  (await fetchFirestoreCollection("recordedEventTypes")) as RecordedEventType[]

export const fetchSubject = async (docId: string) => {
  const firestoreDoc = (await fetchFirestoreDocument(
    firestore_collection_key.articles,
    docId
  )) as UnsanitizedFirestoreDocument<FetchedSubject>

  const sanitised = sanitiseNonSerializableDoc(firestoreDoc) as SanitisedSubject

  return sanitised
}

export const fetchSubjects = async (ids?: string[]) => {
  const firestoreDocs = (
    ids
      ? await fetchFirestorePublishableDocuments("subjects", ids)
      : await fetchFirestorePublishableCollection("subjects")
  ) as UnsanitizedFirestoreDocument<FetchedSubject>[]

  const sanitised = sanitiseNonSerializableCollection(
    firestoreDocs
  ) as SanitisedSubject[]

  return sanitised
}

export const fetchTags = async (ids: string[]) =>
  (await fetchFirestoreDocuments("tags", ids)) as Tag[]
