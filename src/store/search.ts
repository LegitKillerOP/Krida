import { create } from 'zustand'

interface SearchState {
  query: string
  isOpen: boolean
  open: () => void
  close: () => void
  setQuery: (q: string) => void
}

export const useSearch = create<SearchState>((set) => ({
  query: '',
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: '' }),
  setQuery: (query) => set({ query }),
}))
