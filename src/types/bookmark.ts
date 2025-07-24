// src/types/bookmark.ts
export interface Bookmark {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  chapterNumber: number;
  scrollPosition: number;
  scrollPercentage: number;
  lastRead: Date;
  isCompleted: boolean;
}

// ---
