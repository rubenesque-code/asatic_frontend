export const firestore_collection_key = {
  articles: "articles",
  authors: "authors",
  blogs: "blogs",
  collections: "collections",
  images: "images",
  languages: "languages",
  tags: "tags",
  landing: "landing",
  recordedevents: "recordedEvents",
  recordedeventtypes: "recordedEventTypes",
  subjects: "subjects",
  about: "about",
} as const

export type FirestoreCollectionKey =
  typeof firestore_collection_key[keyof typeof firestore_collection_key]
