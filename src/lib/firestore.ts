// src/lib/firestore.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Book, Chapter } from '@/types/book'
import { Bookmark } from '@/types/bookmark'
import { Highlight } from '@/types/highlight'

// Book operations
export const createBook = async (bookData: Omit<Book, 'id'>) => {
  const docRef = await addDoc(collection(db, 'books'), {
    ...bookData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const getBook = async (bookId: string): Promise<Book | null> => {
  const docRef = doc(db, 'books', bookId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Book
  }
  
  return null
}

export const updateBook = async (bookId: string, updates: Partial<Book>) => {
  const docRef = doc(db, 'books', bookId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteBook = async (bookId: string) => {
  await deleteDoc(doc(db, 'books', bookId))
}

// Chapter operations
export const getBookChapters = async (bookId: string): Promise<Chapter[]> => {
  const q = query(
    collection(db, 'chapters'),
    where('bookId', '==', bookId),
    orderBy('chapterNumber', 'asc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Chapter[]
}

export const getChapter = async (chapterId: string): Promise<Chapter | null> => {
  const docRef = doc(db, 'chapters', chapterId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Chapter
  }
  
  return null
}

// Bookmark operations
export const saveBookmark = async (userId: string, bookmark: Omit<Bookmark, 'id'>) => {
  // Check if bookmark already exists for this user and book
  const q = query(
    collection(db, 'bookmarks'),
    where('userId', '==', userId),
    where('bookId', '==', bookmark.bookId),
    limit(1)
  )
  
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    // Create new bookmark
    await addDoc(collection(db, 'bookmarks'), {
      ...bookmark,
      lastRead: Timestamp.now(),
    })
  } else {
    // Update existing bookmark
    const docRef = snapshot.docs[0].ref
    await updateDoc(docRef, {
      ...bookmark,
      lastRead: Timestamp.now(),
    })
  }
}

export const getUserBookmark = async (userId: string, bookId: string): Promise<Bookmark | null> => {
  const q = query(
    collection(db, 'bookmarks'),
    where('userId', '==', userId),
    where('bookId', '==', bookId),
    limit(1)
  )
  
  const snapshot = await getDocs(q)
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
      lastRead: doc.data().lastRead?.toDate() || new Date(),
    } as Bookmark
  }
  
  return null
}

// Highlight operations
export const saveHighlight = async (highlight: Omit<Highlight, 'id'>) => {
  const docRef = await addDoc(collection(db, 'highlights'), {
    ...highlight,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const getUserHighlights = async (userId: string, bookId: string): Promise<Highlight[]> => {
  const q = query(
    collection(db, 'highlights'),
    where('userId', '==', userId),
    where('bookId', '==', bookId),
    orderBy('createdAt', 'asc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Highlight[]
}

export const deleteHighlight = async (highlightId: string) => {
  await deleteDoc(doc(db, 'highlights', highlightId))
}