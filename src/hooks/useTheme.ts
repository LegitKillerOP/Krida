import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  dark: boolean
  toggle: () => void
  set: (v: boolean) => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark
        document.documentElement.classList.toggle('dark', next)
        set({ dark: next })
      },
      set: (v) => {
        document.documentElement.classList.toggle('dark', v)
        set({ dark: v })
      },
    }),
    { name: 'krida-theme' },
  ),
)
