import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  User,
  Calendar,
  Clock,
  History,
  Wallet,
  Users,
  Tent,
  Heart,
  Settings,
  MapPin,
  Edit3,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  LogOut,
} from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import { useQuery } from '@tanstack/react-query'
import { useAuth, logout } from '@/store/auth'
import { getBookingsByUser, getVenues, getEvents } from '@/services/db'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui'
import type { User as UserType, Booking, Venue, Event } from '@/types'

const tabs = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'bookings', label: 'My Bookings', icon: Calendar },
  { value: 'upcoming', label: 'Upcoming Games', icon: Clock },
  { value: 'past', label: 'Past Games', icon: History },
  { value: 'wallet', label: 'Wallet', icon: Wallet },
  { value: 'joined', label: 'Joined Events', icon: Users },
  { value: 'hosted', label: 'Hosted Events', icon: Tent },
  { value: 'saved', label: 'Saved Venues', icon: Heart },
  { value: 'settings', label: 'Settings', icon: Settings },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const { data: allBookings = [] } = useQuery({
    queryKey: ['bookings', user?.id ?? 'guest'],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([])
      return getBookingsByUser(user.id)
    },
    enabled: !!user?.id,
  })

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
  })

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const getVenueName = (venueId: string) => {
    return venues.find((v) => v.id === venueId)?.name ?? 'Unknown Venue'
  }

  const userBookings = allBookings.filter((b) => b.userId === user?.id)
  const upcomingBookings = userBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending')
  const pastBookings = userBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled')
  const joinedEvents = events.filter((e) => e.participants?.includes(user?.id ?? ''))
  const savedVenues = venues.slice(0, 3)

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12 sm:px-8 lg:px-12 bg-surface text-ink dark:bg-ink dark:text-surface">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Sidebar - Desktop Only */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <nav className="sticky top-24 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.value
                        ? 'bg-ink text-surface dark:bg-surface dark:text-ink'
                        : 'text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-surface/5 dark:hover:text-surface'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    window.location.href = '/'
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </nav>
          </aside>

          {/* Main workspace container */}
          <div className="flex-1 min-w-0">
            {/* Mobile Navigation Viewport Header */}
            <div className="lg:hidden mb-6">
              <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-1 overflow-x-auto rounded-xl bg-ink/5 p-1 dark:bg-surface/5 no-scrollbar">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <Tabs.Trigger
                        key={tab.value}
                        value={tab.value}
                        className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-sm dark:data-[state=active]:bg-ink dark:data-[state=active]:text-surface"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </Tabs.Trigger>
                    )
                  })}
                </Tabs.List>
              </Tabs.Root>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent(activeTab, user, getVenueName, upcomingBookings, pastBookings, joinedEvents, savedVenues, userBookings, venues)}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}

function renderTabContent(
  tab: string,
  user: UserType | null,
  getVenueName: (id: string) => string,
  upcomingBookings: Booking[],
  pastBookings: Booking[],
  joinedEvents: Event[],
  savedVenues: Venue[],
  allBookings: Booking[],
  venues: Venue[],
) {
  switch (tab) {
    case 'profile':
      return <ProfileTab user={user} bookings={allBookings} />
    case 'bookings':
      return <BookingsTab bookings={allBookings} venues={venues} user={user} />
    case 'upcoming':
      return <UpcomingTab bookings={upcomingBookings} getVenueName={getVenueName} />
    case 'past':
      return <PastTab bookings={pastBookings} getVenueName={getVenueName} />
    case 'wallet':
      return <WalletTab bookings={allBookings} />
    case 'joined':
      return <JoinedEventsTab events={joinedEvents} />
    case 'hosted':
      return <HostedEventsTab />
    case 'saved':
      return <SavedVenuesTab venues={savedVenues} />
    case 'settings':
      return <SettingsTab user={user} />
    default:
      return null
  }
}

function ProfileTab({ user, bookings }: { user: UserType | null; bookings: Booking[] }) {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Profile</h1>
      <div className="card p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-neutral-200">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-neutral-500">
                {user?.name?.[0] ?? 'U'}
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-2xl font-semibold text-neutral-900">
              {user?.name ?? 'User'}
            </h2>
            <p className="text-neutral-600">{user?.email}</p>
            {user?.phone && (
              <p className="mt-1 flex items-center justify-center gap-1 text-sm text-neutral-500 sm:justify-start">
                <MapPin className="h-3 w-3" />
                {user.phone}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" className="sm:ml-auto border-neutral-200 text-neutral-800 hover:bg-neutral-50">
            <Edit3 className="h-4 w-4" />
            Edit profile
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-6 text-center">
          <p className="font-heading text-3xl font-bold text-neutral-900">{bookings.length}</p>
          <p className="text-sm text-neutral-500">Total Bookings</p>
        </div>
        <div className="card p-6 text-center">
          <p className="font-heading text-3xl font-bold text-neutral-900">
            {bookings.filter((b) => b.status === 'completed').length}
          </p>
          <p className="text-sm text-neutral-500">Completed</p>
        </div>
        <div className="card p-6 text-center">
          <p className="font-heading text-3xl font-bold text-neutral-900">
            {bookings.reduce((sum, b) => sum + b.hours, 0)}
          </p>
          <p className="text-sm text-neutral-500">Hours Played</p>
        </div>
      </div>
    </div>
  )
}

function BookingsTab({
  bookings,
  venues,
  user,
}: {
  bookings: Booking[]
  venues: Venue[]
  user: UserType | null
}) {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed'>('all')

  const getVenueNameLocal = (venueId: string) => {
    return venues.find((v) => v.id === venueId)?.name ?? 'Unknown Venue'
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  function handleDownloadReceipt(booking: Booking) {
    const venue = venues.find((v) => v.id === booking.venueId)
    if (!venue || !user) return
    const text = `
════════════════════════════════════════════════
              KRIDA — BOOKING RECEIPT
════════════════════════════════════════════════

Booking ID:    ${booking.id}
Date:          ${formatDate(booking.createdAt)}

─── PLAYER ────────────────────────────────────
Name:          ${user.name}
Email:         ${user.email}

─── VENUE ─────────────────────────────────────
Venue:         ${venue.name}
Sport:         ${venue.sport.charAt(0).toUpperCase() + venue.sport.slice(1)}
Address:       ${venue.address}, ${venue.city}

─── BOOKING DETAILS ───────────────────────────
Date:          ${formatDate(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Time:          ${booking.slot}
Duration:      ${booking.hours} hour${booking.hours > 1 ? 's' : ''}
Players:       ${booking.players ?? 1}

─── PAYMENT ───────────────────────────────────
Amount:        ${formatPrice(booking.price)}
Payment ID:    ${booking.paymentId ?? 'N/A'}
Status:        ${booking.status.toUpperCase()}

────────────────────────────────────────────────
Thank you for booking with KRIDA!
For support: support@krida.app
════════════════════════════════════════════════
`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KRIDA-Receipt-${booking.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">My Bookings</h1>
        <span className="text-sm text-muted">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-ink/5 p-1 dark:bg-surface/5">
        {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-surface text-ink shadow-sm dark:bg-ink dark:text-surface'
                : 'text-muted hover:text-ink dark:hover:text-surface'
            }`}
          >
            {status}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              filter === status
                ? 'bg-accent/20 text-accent'
                : 'bg-ink/5 text-muted dark:bg-surface/10'
            }`}>
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings found" description={filter === 'all' ? 'Book a venue to get started!' : `No ${filter} bookings.`} />
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const venue = venues.find((v) => v.id === booking.venueId)
            return (
              <div key={booking.id} className="card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-neutral-900">
                        {getVenueNameLocal(booking.venueId)}
                      </h3>
                      <Badge
                        variant={
                          booking.status === 'confirmed'
                            ? 'success'
                            : booking.status === 'pending'
                              ? 'warning'
                              : booking.status === 'cancelled'
                                ? 'danger'
                                : 'default'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                      <span>{formatDate(booking.date)}</span>
                      <span>{booking.slot}</span>
                      <span>{booking.hours}h</span>
                      <span>{booking.players ?? 1} player{(booking.players ?? 1) > 1 ? 's' : ''}</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400 font-mono">{booking.id}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                    <p className="font-heading font-semibold text-neutral-900">
                      {formatPrice(booking.price)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => handleDownloadReceipt(booking)}
                    >
                      <Download className="h-3 w-3" />
                      Receipt
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function UpcomingTab({
  bookings,
  getVenueName,
}: {
  bookings: Booking[]
  getVenueName: (id: string) => string
}) {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Upcoming Games</h1>
      {bookings.length === 0 ? (
        <EmptyState icon={Clock} title="No upcoming games" description="Book a venue to get started!" />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-neutral-900">
                  {getVenueName(booking.venueId)}
                </h3>
                <p className="text-sm text-neutral-500">
                  {formatDate(booking.date)} at {booking.slot} ({booking.hours}h)
                </p>
              </div>
              <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'} className="w-fit">
                {booking.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PastTab({
  bookings,
  getVenueName,
}: {
  bookings: Booking[]
  getVenueName: (id: string) => string
}) {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Past Games</h1>
      {bookings.length === 0 ? (
        <EmptyState icon={History} title="No past games" description="Your completed bookings will appear here." />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-neutral-900">
                  {getVenueName(booking.venueId)}
                </h3>
                <p className="text-sm text-neutral-500">
                  {formatDate(booking.date)} at {booking.slot}
                </p>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <p className="text-sm text-neutral-600">{formatPrice(booking.price)}</p>
                <Badge variant={booking.status === 'completed' ? 'success' : 'danger'}>
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WalletTab({ bookings }: { bookings: Booking[] }) {
  const totalSpent = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.price, 0)
  const balance = 2500 - totalSpent

  const transactions = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({
      id: b.id,
      type: 'debit' as const,
      amount: b.price,
      description: `Booking ${b.id}`,
      date: b.date,
    }))
    .reverse()
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Wallet</h1>

      <div className="card bg-neutral-950 p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-70 text-neutral-300">Available Balance</p>
            <p className="mt-2 font-heading text-4xl font-bold text-white">{formatPrice(balance)}</p>
          </div>
          <CreditCard className="h-8 w-8 opacity-50 text-white" />
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="accent" size="sm">
            Add Money
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Withdraw
          </Button>
        </div>
      </div>

      <h2 className="font-heading text-xl font-semibold text-ink dark:text-surface">
        Transaction History
      </h2>
      {transactions.length === 0 ? (
        <EmptyState icon={Wallet} title="No transactions" description="Your transactions will appear here." />
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{tx.description}</p>
                  <p className="text-xs text-neutral-500">{formatDate(tx.date)}</p>
                </div>
              </div>
              <p className="font-heading font-semibold text-red-600">
                -{formatPrice(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function JoinedEventsTab({ events }: { events: Event[] }) {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Joined Events</h1>
      {events.length === 0 ? (
        <EmptyState icon={Users} title="No joined events" description="Events you join will appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <div key={event.id} className="card overflow-hidden flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-neutral-900">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {formatDate(event.date)} at {event.time}
                  </p>
                  <p className="text-sm text-neutral-500">{event.venue}</p>
                </div>
                <Badge variant="success" className="mt-3 w-fit">
                  {event.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function HostedEventsTab() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Hosted Events</h1>
      <EmptyState
        icon={Tent}
        title="No hosted events"
        description="Create an event and start bringing the community together."
        action={{ label: 'Create Event', to: '/events/create' }}
      />
    </div>
  )
}

function SavedVenuesTab({ venues }: { venues: Venue[] }) {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Saved Venues</h1>
      {venues.length === 0 ? (
        <EmptyState icon={Heart} title="No saved venues" description="Venues you save will appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div key={venue.id} className="card overflow-hidden">
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <img
                  src={venue.images?.[0]}
                  alt={venue.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-neutral-900">
                  {venue.name}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                  <MapPin className="h-3 w-3" />
                  {venue.city}
                </p>
                <p className="mt-2 font-heading font-semibold text-neutral-900">
                  {formatPrice(venue.price)}
                  <span className="text-sm font-normal text-neutral-500"> / hour</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SettingsTab({ user }: { user: UserType | null }) {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-ink dark:text-surface">Settings</h1>
      <div className="card p-8">
        <h2 className="font-heading text-xl font-semibold text-neutral-900">
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-neutral-500">Update your personal details below.</p>
        <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-800">
              Full Name
            </label>
            <Input defaultValue={user?.name ?? ''} className="bg-white text-neutral-950 border-neutral-200 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-800">
              Email
            </label>
            <Input defaultValue={user?.email ?? ''} type="email" className="bg-white text-neutral-950 border-neutral-200 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-800">
              Phone
            </label>
            <Input defaultValue={user?.phone ?? ''} type="tel" className="bg-white text-neutral-950 border-neutral-200 focus:ring-accent" />
          </div>
          <Button type="submit" variant="accent">
            Save Changes
          </Button>
        </form>
      </div>

      <div className="card p-8">
        <h2 className="font-heading text-xl font-semibold text-neutral-900">
          Account Actions
        </h2>
        <p className="mt-1 text-sm text-neutral-500">Manage your account preferences.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" className="border-neutral-200 text-neutral-800 hover:bg-neutral-50">Change Password</Button>
          <Button variant="outline" className="border-neutral-200 text-neutral-800 hover:bg-neutral-50">Notification Preferences</Button>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Delete Account</Button>
        </div>
      </div>
    </div>
  )
}
