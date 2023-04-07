import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "@firebase/firestore/lite"

import { firestore } from "../init"

import { FirestoreCollectionKey } from "^constants/firestoreCollections"

// * if fetching by documentId and it doesn't exist, firestore won't return anything
// * can't query for value of object field in array field of doc. e.g. can't check if article.translations[number].title has string with length

export const fetchFirestoreDocument = async (
  collectionKey: FirestoreCollectionKey,
  documentId: string
) => {
  const documentRef = doc(firestore, collectionKey, documentId)
  const docSnap = await getDoc(documentRef)
  const data = docSnap.data()

  return data
}

export const fetchFirestoreDocuments = async (
  collectionKey: FirestoreCollectionKey,
  docIds: string[]
  // additionalQueryContstraint?: QueryConstraint
) => {
  try {
    const idBatches: string[][] = [[]]

    docIds.forEach((id, i) => {
      const num = i + 1
      const batchIndex = Math.floor(num / 10)
      if (idBatches[batchIndex]) {
        idBatches[batchIndex].push(id)
      } else {
        idBatches[batchIndex] = [id]
      }
    })

    const promises: Promise<QuerySnapshot<DocumentData>>[] = []

    idBatches.forEach((idBatch) => {
      const docsRefs = query(
        collection(firestore, collectionKey),
        where("id", "in", idBatch)
      )
      const getDocsSnap = getDocs(docsRefs)

      promises.push(getDocsSnap)
    })

    /*     const docsRefs = additionalQueryContstraint
      ? docIds.length
        ? query(
            collection(firestore, collectionKey),
            where("id", "in", docIds),
            additionalQueryContstraint
          )
        : query(
            collection(firestore, collectionKey),
            additionalQueryContstraint
          )
      : docIds.length
      ? query(collection(firestore, collectionKey), where("id", "in", docIds))
      : query(collection(firestore, collectionKey)) */

    /*     const docsSnap = await getDocs(docsRefs)
    const data: DocumentData[] = []
    docsSnap.forEach((doc) => {
      const d = doc.data()
      data.push(d)
    }) */

    const docsSnapBatches = await Promise.all(promises)
    const data = docsSnapBatches
      .flatMap((docSnap) => docSnap.docs)
      .map((doc) => doc.data())

    return data
  } catch (error) {
    // console.log("error:", error)
  }
}

export const fetchFirestoreCollection = async (
  collectionKey: FirestoreCollectionKey
) => {
  const collectionRef = collection(firestore, collectionKey)
  const docsSnap = await getDocs(collectionRef)
  const data: DocumentData[] = []
  docsSnap.forEach((doc) => {
    const d = doc.data()
    data.push(d)
  })

  return data
}

export async function fetchFirestorePublishableDocuments(
  collectionKey: Extract<
    FirestoreCollectionKey,
    "articles" | "blogs" | "collections" | "recordedEvents" | "subjects"
  >,
  docIds: string[]
) {
  try {
    const idBatches: string[][] = [[]]

    docIds.forEach((id, i) => {
      const num = i + 1
      const batchIndex = Math.floor(num / 10)
      if (idBatches[batchIndex]) {
        idBatches[batchIndex].push(id)
      } else {
        idBatches[batchIndex] = [id]
      }
    })

    const promises: Promise<QuerySnapshot<DocumentData>>[] = []

    idBatches.forEach((idBatch) => {
      const docsRefs = query(
        collection(firestore, collectionKey),
        where("id", "in", idBatch),
        where("publishStatus", "==", "published")
      )
      const getDocsSnap = getDocs(docsRefs)

      promises.push(getDocsSnap)
    })

    const docsSnapBatches = await Promise.all(promises)
    const data = docsSnapBatches
      .flatMap((docSnap) => docSnap.docs)
      .map((doc) => doc.data())

    return data
  } catch (error) {}
}

export async function fetchFirestorePublishableCollection(
  collectionKey: Extract<
    FirestoreCollectionKey,
    "articles" | "blogs" | "collections" | "recordedEvents" | "subjects"
  >
) {
  const docsRefs = query(
    collection(firestore, collectionKey),
    where("publishStatus", "==", "published")
  )
  const docsSnap = await getDocs(docsRefs)
  const data: DocumentData[] = []
  docsSnap.forEach((doc) => {
    const d = doc.data()
    data.push(d)
  })

  return data
}
