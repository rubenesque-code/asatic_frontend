import {
  doc,
  getDoc,
  collection,
  getDocs,
  DocumentData,
  query,
  where,
  QueryConstraint,
} from '@firebase/firestore/lite'

import { firestore } from '../init'

import { FirestoreCollectionKey } from '^constants/firestoreCollections'

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
  docIds: string[],
  additionalQueryContstraint?: QueryConstraint
) => {
  const docsRefs = additionalQueryContstraint
    ? query(
        collection(firestore, collectionKey),
        where('id', 'in', docIds),
        additionalQueryContstraint
      )
    : query(collection(firestore, collectionKey), where('id', 'in', docIds))

  const docsSnap = await getDocs(docsRefs)
  const data: DocumentData[] = []
  docsSnap.forEach((doc) => {
    const d = doc.data()
    data.push(d)
  })

  return data
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
    'articles' | 'blogs' | 'collections' | 'recordedEvents'
  >,
  docIds: string[]
) {
  const docsRefs = query(
    collection(firestore, collectionKey),
    where('id', 'in', docIds),
    where('publishStatus', '==', 'published')
  )
  const docsSnap = await getDocs(docsRefs)
  const data: DocumentData[] = []
  docsSnap.forEach((doc) => {
    const d = doc.data()
    data.push(d)
  })

  return data
}

export async function fetchFirestorePublishableCollection(
  collectionKey: Extract<
    FirestoreCollectionKey,
    'articles' | 'blogs' | 'collections' | 'recordedEvents'
  >
) {
  const docsRefs = query(
    collection(firestore, collectionKey),
    where('publishStatus', '==', 'published')
  )
  const docsSnap = await getDocs(docsRefs)
  const data: DocumentData[] = []
  docsSnap.forEach((doc) => {
    const d = doc.data()
    data.push(d)
  })

  return data
}
