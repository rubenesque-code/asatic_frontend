import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore/lite'
import {
  getStorage,
  connectStorageEmulator,
  FirebaseStorage,
} from 'firebase/storage'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

let firestore: Firestore
let storage: FirebaseStorage

const apps = getApps()
const appInitialised = apps.length

const initFirebaseApp = () => initializeApp(config)

if (!appInitialised) {
  const app = initFirebaseApp()

  firestore = getFirestore(app)
  storage = getStorage(app)

  if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
    connectStorageEmulator(storage, '127.0.0.1', 9199)
  }
}

export { firestore, storage }
// export { firestore, auth, storage }
