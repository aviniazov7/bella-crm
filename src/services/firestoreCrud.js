/**
 * Generic Firestore CRUD factory.
 *
 * Every collection in Bella CRM shares the same basic create/read/update/delete
 * shape, so we build those once and let each service add its domain-specific
 * queries on top. Keeping the Firestore SDK calls in one place also makes the
 * services trivial to mock in unit tests.
 */
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

/** Convert a Firestore document snapshot into a plain object with its id. */
export function mapDoc(snapshot) {
  return { id: snapshot.id, ...snapshot.data() }
}

export function createCollectionService(collectionName, { defaultOrderBy = 'createdAt' } = {}) {
  const ref = () => collection(db, collectionName)

  /** List all documents, ordered by the default field (descending). */
  async function list() {
    const q = query(ref(), orderBy(defaultOrderBy, 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(mapDoc)
  }

  /** Fetch a single document by id, or null when it does not exist. */
  async function get(id) {
    const snapshot = await getDoc(doc(db, collectionName, id))
    return snapshot.exists() ? mapDoc(snapshot) : null
  }

  /** Create a document, stamping createdAt/updatedAt server timestamps. */
  async function create(data) {
    const docRef = await addDoc(ref(), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...data }
  }

  /** Patch an existing document. */
  async function update(id, data) {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return { id, ...data }
  }

  /** Permanently delete a document. */
  async function remove(id) {
    await deleteDoc(doc(db, collectionName, id))
    return id
  }

  /**
   * Subscribe to realtime updates for the whole collection.
   * @returns {() => void} unsubscribe function
   */
  function subscribe(callback, onError) {
    const q = query(ref(), orderBy(defaultOrderBy, 'desc'))
    return onSnapshot(
      q,
      (snapshot) => callback(snapshot.docs.map(mapDoc)),
      (err) => onError && onError(err)
    )
  }

  return { collectionName, ref, list, get, create, update, remove, subscribe }
}
