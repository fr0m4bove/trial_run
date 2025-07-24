// src/types/user.ts
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

// ---