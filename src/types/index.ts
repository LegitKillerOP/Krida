export interface User {
  id: string
  name: string
  email: string
  photo?: string
  phone?: string
  role: 'user' | 'admin' | 'host'
  createdAt: string
}

export interface Venue {
  id: string
  name: string
  slug: string
  sport: string
  address: string
  city: 'Gandhinagar' | 'Ahmedabad'
  price: number
  weekendPrice?: number
  images: string[]
  facilities: string[]
  slots: string[]
  rating: number
  reviewCount: number
  lat: number
  lng: number
  description?: string
}

export interface Booking {
  id: string
  userId: string
  venueId: string
  date: string
  slot: string
  hours: number
  price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

export interface Event {
  id: string
  title: string
  slug: string
  sport: string
  venue: string
  venueId: string
  date: string
  time: string
  host: string
  hostId: string
  fee: number
  slots: number
  maxSlots: number
  participants: string[]
  description: string
  image: string
  status: 'upcoming' | 'full' | 'completed' | 'cancelled'
}

export interface Review {
  id: string
  userId: string
  userName: string
  userPhoto?: string
  venueId: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
}
