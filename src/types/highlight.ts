// src/types/highlight.ts
export interface Highlight {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  color: HighlightColor;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

// ---