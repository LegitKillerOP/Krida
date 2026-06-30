import { database } from '@/firebase'
import {
  ref,
  get,
  set,
  update,
  push,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
} from 'firebase/database'
import type { Venue, Event, Booking, Review, User } from '@/types'

// ─── Venues ───────────────────────────────────────────────────────────────────

export async function getVenues(): Promise<Venue[]> {
  const snapshot = await get(ref(database, 'venues'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, value]) => ({ ...(value as Venue), id }))
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const snapshot = await get(ref(database, `venues/${id}`))
  if (!snapshot.exists()) return null
  return { ...(snapshot.val() as Venue), id }
}

export async function getVenuesBySport(sport: string): Promise<Venue[]> {
  const q = query(ref(database, 'venues'), orderByChild('sport'), equalTo(sport))
  const snapshot = await get(q)
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, value]) => ({ ...(value as Venue), id }))
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
  const snapshot = await get(ref(database, 'events'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, value]) => ({ ...(value as Event), id }))
}

export async function getEventById(id: string): Promise<Event | null> {
  const snapshot = await get(ref(database, `events/${id}`))
  if (!snapshot.exists()) return null
  return { ...(snapshot.val() as Event), id }
}

export async function getEventsBySport(sport: string): Promise<Event[]> {
  const q = query(ref(database, 'events'), orderByChild('sport'), equalTo(sport))
  const snapshot = await get(q)
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, value]) => ({ ...(value as Event), id }))
}

export async function joinEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = ref(database, `events/${eventId}`)
  const snapshot = await get(eventRef)
  if (!snapshot.exists()) return
  const event = snapshot.val() as Event
  const participants = event.participants ?? []
  if (!participants.includes(userId)) {
    participants.push(userId)
    await update(eventRef, { participants, slots: Math.max(0, event.slots - 1) })
  }
}

export async function bookSlots(eventId: string, userId: string, slots: number): Promise<void> {
  const eventRef = ref(database, `events/${eventId}`)
  const snapshot = await get(eventRef)
  if (!snapshot.exists()) return
  const event = snapshot.val() as Event
  const participants = event.participants ?? []

  // Add user to participants if not already joined
  if (!participants.includes(userId)) {
    participants.push(userId)
  }

  // Decrease available slots by the booked amount
  const newSlots = Math.max(0, (event.slots ?? 0) - slots)

  // Update status if full
  const status = newSlots <= 0 ? 'full' : event.status

  await update(eventRef, { participants, slots: newSlots, status })
}

export async function leaveEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = ref(database, `events/${eventId}`)
  const snapshot = await get(eventRef)
  if (!snapshot.exists()) return
  const event = snapshot.val() as Event
  const participants = (event.participants ?? []).filter((id) => id !== userId)
  await update(eventRef, { participants, slots: event.slots + 1 })
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking(booking: Omit<Booking, 'id'>): Promise<string> {
  const newRef = push(ref(database, 'bookings'))
  await set(newRef, { ...booking, createdAt: new Date().toISOString() })
  return newRef.key!
}

export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  // Fetch all bookings and filter client-side (avoids index requirement)
  const snapshot = await get(ref(database, 'bookings'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data)
    .map(([id, value]) => ({ ...(value as Booking), id }))
    .filter((b) => b.userId === userId)
}

export async function getAllBookings(): Promise<Booking[]> {
  const snapshot = await get(ref(database, 'bookings'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, value]) => ({ ...(value as Booking), id }))
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking['status']
): Promise<void> {
  await update(ref(database, `bookings/${bookingId}`), { status })
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviewsByVenue(venueId: string): Promise<Review[]> {
  const q = query(ref(database, 'reviews'), orderByChild('venueId'), equalTo(venueId))
  const snapshot = await get(q)
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, value]) => ({ ...(value as Review), id }))
}

export async function addReview(review: Omit<Review, 'id'>): Promise<string> {
  const newRef = push(ref(database, 'reviews'))
  await set(newRef, review)
  return newRef.key!
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUser(userId: string): Promise<User | null> {
  const snapshot = await get(ref(database, `users/${userId}`))
  if (!snapshot.exists()) return null
  return { ...(snapshot.val() as User), id: userId }
}

export async function createUser(user: User): Promise<void> {
  await set(ref(database, `users/${user.id}`), user)
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  await update(ref(database, `users/${userId}`), data)
}

// ─── Admin / Stats ────────────────────────────────────────────────────────────

export async function getBookingCount(): Promise<number> {
  const snapshot = await get(ref(database, 'bookings'))
  return snapshot.exists() ? Object.keys(snapshot.val()).length : 0
}

export async function getRecentBookings(limit = 5): Promise<Booking[]> {
  const q = query(ref(database, 'bookings'), orderByChild('createdAt'), limitToFirst(limit))
  const snapshot = await get(q)
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data)
    .map(([id, value]) => ({ ...(value as Booking), id }))
    .reverse()
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await get(ref(database, 'users'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, value]) => ({ ...(value as User), id }))
}

export async function updateUserRole(userId: string, role: User['role']): Promise<void> {
  await update(ref(database, `users/${userId}`), { role })
}

export async function createVenue(venue: Omit<Venue, 'id'>): Promise<string> {
  const newRef = push(ref(database, 'venues'))
  await set(newRef, venue)
  return newRef.key!
}

export async function updateVenue(venueId: string, data: Partial<Venue>): Promise<void> {
  await update(ref(database, `venues/${venueId}`), data)
}

export async function deleteVenue(venueId: string): Promise<void> {
  await set(ref(database, `venues/${venueId}`), null)
}

export async function createEvent(event: Omit<Event, 'id'>): Promise<string> {
  const newRef = push(ref(database, 'events'))
  await set(newRef, event)
  return newRef.key!
}

export async function updateEvent(eventId: string, data: Partial<Event>): Promise<void> {
  await update(ref(database, `events/${eventId}`), data)
}

export async function deleteEvent(eventId: string): Promise<void> {
  await set(ref(database, `events/${eventId}`), null)
}

export async function deleteBooking(bookingId: string): Promise<void> {
  await set(ref(database, `bookings/${bookingId}`), null)
}
