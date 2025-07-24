// src/types/book.ts - Updated version (keep your existing structure + add Firebase fields)
export interface Book {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  
  // Add these Firebase fields to your existing interface:
  pdfUrl: string; // URL to the PDF file in Firebase Storage
  uploadedBy: string; // User ID of who uploaded it (same as authorId)
  uploadedAt: any; // Firebase Timestamp
  status: 'published' | 'draft' | 'archived'; // Add status field
  fileSize: number; // PDF file size in bytes
  fileName: string; // Original PDF filename
  
  // Keep your existing fields:
  authorId: string; // Admin who uploaded (can map this to uploadedBy)
  chapters: Chapter[];
  totalChapters: number;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean; // You can map this to status field
  metadata: BookMetadata;
}

export interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  content: string; // HTML content
  wordCount: number;
  estimatedReadTime: number; // in minutes
}

export interface BookMetadata {
  originalFileName: string;
  fileSize: number;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  conversionLog?: string;
}

// Keep your User types exactly as they are - they're perfect!
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin: Date;
}

export interface UserPreferences {
  theme: 'dark-academia' | 'pink-floral' | 'minimalist' | 'cozy-library';
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  readingWidth: 'narrow' | 'medium' | 'wide';
}