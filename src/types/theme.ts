// src/types/theme.ts
export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  effects: ThemeEffects;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  serif: string;
}

export interface ThemeEffects {
  backgroundImage?: string;
  borderStyle?: string;
  shadows?: string;
  animations?: string;
}

// ---