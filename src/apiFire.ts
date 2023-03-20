import { initializeApp } from 'firebase/app';
import { collection, CollectionReference, DocumentData, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { ashData, globalData, logsData, slotsData, statesData, usersData } from 'types/Test';

// Init the firebase app
export const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
})

// Export firestore incase we need to access it directly
export const firestore = getFirestore()
export const storage = getStorage()

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>
}

// export all your collections
export const logsCollection = createCollection<logsData>(process.env.REACT_APP_FIREBASE_COLLECTION + '/docs/logs')
export const plotsCollection = createCollection<slotsData>(process.env.REACT_APP_FIREBASE_COLLECTION + '/docs/plots')
export const statesCollection = createCollection<statesData>(process.env.REACT_APP_FIREBASE_COLLECTION + '/docs/states')
export const usersCollection = createCollection<usersData>(process.env.REACT_APP_FIREBASE_COLLECTION + '/docs/users')
export const globalCollection = createCollection<globalData>(process.env.REACT_APP_FIREBASE_COLLECTION + '/docs/global')
export const ashCollection = createCollection<ashData>(process.env.REACT_APP_FIREBASE_COLLECTION + '/docs/global')
