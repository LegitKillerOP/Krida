/**
 * Email service via Firebase Trigger Email extension
 *
 * Setup:
 * 1. Install "Trigger Email" extension from Firebase Console
 * 2. Configure SMTP connection (SendGrid, Mailgun, Gmail, etc.)
 * 3. Set the collection name (default: "mail")
 * 4. Documents written to the collection will be sent as emails
 *
 * The extension watches the `mail` collection. Each document should have:
 * - to: string (recipient email)
 * - message: object with subject, text, and/or html
 *
 * Docs: https://firebase.google.com/products/extensions/firestore-send-email
 */

import { database } from '@/firebase'
import { ref, push, serverTimestamp } from 'firebase/database'
import type { Booking, Venue, User } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

interface MailPayload {
  to: string
  message: {
    subject: string
    text: string
    html?: string
  }
  bookingId?: string
  createdAt?: string | object
}

async function sendMail(payload: MailPayload): Promise<void> {
  const mailRef = push(ref(database, 'mail'))
  await push(ref(database, 'mail'), {
    ...payload,
    createdAt: serverTimestamp(),
  })
}

export async function sendBookingReceipt(booking: Booking, venue: Venue, user: User): Promise<void> {
  const subject = `Booking Confirmed — ${venue.name} | ${booking.id}`
  const text = `
Hi ${user.name},

Your booking has been confirmed!

Booking Details:
- Venue: ${venue.name}
- Sport: ${venue.sport.charAt(0).toUpperCase() + venue.sport.slice(1)}
- Date: ${formatDate(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
- Time: ${booking.slot}
- Duration: ${booking.hours} hour${booking.hours > 1 ? 's' : ''}
- Players: ${booking.players ?? 1}
- Amount: ${formatPrice(booking.price)}
- Payment ID: ${booking.paymentId ?? 'N/A'}
- Booking ID: ${booking.id}

Thank you for booking with KRIDA!
For any queries, reply to this email or contact support@krida.app

— Team KRIDA
`

  const html = `
<div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1a1a1a;">Booking Confirmed!</h2>
  <p>Hi ${user.name},</p>
  <p>Your booking has been confirmed!</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr><td style="padding: 8px 0; color: #666;">Venue</td><td style="padding: 8px 0; font-weight: 600;">${venue.name}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Sport</td><td style="padding: 8px 0; font-weight: 600; text-transform: capitalize;">${venue.sport}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Date</td><td style="padding: 8px 0; font-weight: 600;">${formatDate(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0; font-weight: 600;">${booking.slot}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Duration</td><td style="padding: 8px 0; font-weight: 600;">${booking.hours} hour${booking.hours > 1 ? 's' : ''}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Players</td><td style="padding: 8px 0; font-weight: 600;">${booking.players ?? 1}</td></tr>
    <tr style="border-top: 2px solid #eee;"><td style="padding: 12px 0; color: #666;">Amount</td><td style="padding: 12px 0; font-weight: 700; color: #7CFF4D;">${formatPrice(booking.price)}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Payment ID</td><td style="padding: 8px 0; font-weight: 600;">${booking.paymentId ?? 'N/A'}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Booking ID</td><td style="padding: 8px 0; font-weight: 600;">${booking.id}</td></tr>
  </table>
  <p>Thank you for booking with KRIDA!</p>
  <p style="color: #666; font-size: 14px;">For any queries, reply to this email or contact support@krida.app</p>
  <p style="color: #666; font-size: 14px;">— Team KRIDA</p>
</div>
`

  await sendMail({
    to: user.email,
    message: { subject, text, html },
    bookingId: booking.id,
  })
}

export async function sendBulkBookingReceipts(
  booking: Booking,
  venue: Venue,
  user: User,
  players: { name: string; email: string }[]
): Promise<void> {
  // Send to the primary user
  await sendBookingReceipt(booking, venue, user)

  // Send to each additional player
  for (const player of players) {
    if (player.email === user.email) continue // skip if already sent
    const playerUser = { ...user, name: player.name, email: player.email }
    await sendBookingReceipt(booking, venue, playerUser)
  }
}

export async function sendEventJoinEmail(event: { title: string; date: string; time: string; venue: string }, user: User): Promise<void> {
  const subject = `You've joined ${event.title}!`
  const text = `
Hi ${user.name},

You've successfully joined the event!

Event: ${event.title}
Venue: ${event.venue}
Date: ${formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Time: ${event.time}

See you there!

— Team KRIDA
`

  await sendMail({
    to: user.email,
    message: { subject, text },
  })
}
