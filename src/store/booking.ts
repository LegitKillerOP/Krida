import { create } from 'zustand'

interface BookingState {
  sport: string | null
  venue: string | null
  date: string
  slot: string | null
  hours: number
  players: number
  setSport: (s: string | null) => void
  setVenue: (v: string | null) => void
  setDate: (d: string) => void
  setSlot: (s: string | null) => void
  setHours: (h: number) => void
  setPlayers: (p: number) => void
  reset: () => void
}

const todayISO = () => new Date().toISOString().slice(0, 10)

export const useBooking = create<BookingState>((set) => ({
  sport: null,
  venue: null,
  date: todayISO(),
  slot: null,
  hours: 1,
  players: 1,
  setSport: (sport) => set({ sport }),
  setVenue: (venue) => set({ venue }),
  setDate: (date) => set({ date }),
  setSlot: (slot) => set({ slot }),
  setHours: (hours) => set({ hours }),
  setPlayers: (players) => set({ players }),
  reset: () => set({ sport: null, venue: null, date: todayISO(), slot: null, hours: 1, players: 1 }),
}))
