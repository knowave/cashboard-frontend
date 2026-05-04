import { createContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export type ThemeContextValue = {
  mode: ThemeMode | null
  resolvedTheme: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
