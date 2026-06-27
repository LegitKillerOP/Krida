import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Calendar,
  Tent,
  MapPin,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  X,
  Search,
  Shield,
  LayoutDashboard,
  Building2,
  CalendarDays,
  UsersRound,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as Tabs from '@radix-ui/react-tabs'
import { getAllBookings, getVenues, getEvents, getAllUsers, updateUserRole, deleteVenue, deleteEvent, createVenue, createEvent } from '@/services/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SPORTS } from '@/lib/constants'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Venue, User } from '@/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

const tabItems = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'venues', label: 'Venues', icon: Building2 },
  { value: 'events', label: 'Events', icon: CalendarDays },
  { value: 'users', label: 'Users', icon: UsersRound },
]

export default function AdminPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink dark:text-surface sm:text-3xl">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted">Manage venues, events, bookings, and users</p>
              </div>
            </div>
          </motion.div>

          <Tabs.Root defaultValue="overview">
            <Tabs.List className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-ink/5 p-1 dark:bg-dark/5">
              {tabItems.map((tab) => {
                const Icon = tab.icon
                return (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition-colors data-[state=active]:bg-dark data-[state=active]:text-ink data-[state=active]:shadow-sm dark:data-[state=active]:bg-ink dark:data-[state=active]:text-surface"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Tabs.Trigger>
                )
              })}
            </Tabs.List>

            <Tabs.Content value="overview">
              <OverviewTab />
            </Tabs.Content>
            <Tabs.Content value="venues">
              <VenuesTab />
            </Tabs.Content>
            <Tabs.Content value="events">
              <EventsTab />
            </Tabs.Content>
            <Tabs.Content value="users">
              <UsersTab />
            </Tabs.Content>
          </Tabs.Root>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const { data: bookings = [] } = useQuery({ queryKey: ['admin-bookings'], queryFn: getAllBookings })
  const { data: venues = [] } = useQuery({ queryKey: ['admin-venues'], queryFn: getVenues })
  const { data: events = [] } = useQuery({ queryKey: ['admin-events'], queryFn: getEvents })
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: getAllUsers })

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.price, 0)

  const recentBookings = bookings.slice(-5).reverse()

  const sportCounts: Record<string, number> = {}
  venues.forEach((v) => {
    sportCounts[v.sport] = (sportCounts[v.sport] ?? 0) + 1
  })
  const topSports = Object.entries(sportCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      percentage: venues.length > 0 ? Math.round((count / venues.length) * 100) : 0,
    }))

  const stats = [
    { label: 'Revenue', value: formatPrice(totalRevenue), icon: DollarSign, change: '+12.5%', positive: true },
    { label: 'Bookings', value: `${bookings.length}`, icon: Calendar, change: '+8.2%', positive: true },
    { label: 'Events', value: `${events.length}`, icon: Tent, change: '+3', positive: true },
    { label: 'Venues', value: `${venues.length}`, icon: MapPin, change: '+2', positive: true },
    { label: 'Users', value: `${users.length}`, icon: Users, change: '+5', positive: true },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-accent' : 'text-red-500'}`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 font-heading text-xl font-bold text-ink dark:text-dark">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          )
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-ink/5 p-5 dark:border-dark/5">
            <h2 className="font-heading text-base font-semibold text-ink dark:text-dark">Recent Bookings</h2>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted">No bookings yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink/5 text-left text-xs font-medium uppercase tracking-wider text-muted dark:border-dark/5">
                    <th className="px-5 py-3">Venue</th>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5 dark:divide-dark/5">
                  {recentBookings.map((booking) => {
                    const venue = venues.find((v) => v.id === booking.venueId)
                    return (
                      <tr key={booking.id} className="text-sm">
                        <td className="px-5 py-3 font-medium text-ink dark:text-dark">{venue?.name ?? booking.venueId}</td>
                        <td className="px-5 py-3 text-muted">{booking.userId}</td>
                        <td className="px-5 py-3 text-muted">{formatDate(booking.date)}</td>
                        <td className="px-5 py-3 font-medium text-ink dark:text-dark">{formatPrice(booking.price)}</td>
                        <td className="px-5 py-3">
                          <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'danger'}>
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="card p-5">
          <h2 className="font-heading text-base font-semibold text-ink dark:text-dark">Top Sports</h2>
          <div className="mt-4 space-y-3">
            {topSports.length === 0 ? (
              <p className="text-sm text-muted">No venue data yet.</p>
            ) : (
              topSports.map((sport) => (
                <div key={sport.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink dark:text-dark capitalize">{sport.name}</span>
                    <span className="text-muted">{sport.percentage}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-dark/10">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${sport.percentage}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Venues Tab ───────────────────────────────────────────────────────────────

function VenuesTab() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data: venues = [] } = useQuery({ queryKey: ['admin-venues'], queryFn: getVenues })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-venues'] }),
  })

  const filtered = venues.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase()) ||
    v.sport.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          {/* FIXED: Added explicit dark and light mode color bounds */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venues..."
            className="pl-10 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900"
          />
        </div>
        <Button variant="accent" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Add Venue
        </Button>
      </motion.div>

      {showForm && <VenueForm onClose={() => setShowForm(false)} />}

      <motion.div variants={itemVariants} className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No venues found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5 text-left text-xs font-medium uppercase tracking-wider text-muted dark:border-dark/5">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Sport</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 dark:divide-dark/5">
                {filtered.map((venue) => (
                  <tr key={venue.id} className="text-sm">
                    <td className="px-5 py-3 font-medium text-ink dark:text-dark">{venue.name}</td>
                    <td className="px-5 py-3 text-muted capitalize">{venue.sport}</td>
                    <td className="px-5 py-3 text-muted">{venue.city}</td>
                    <td className="px-5 py-3 text-ink dark:text-dark">{formatPrice(venue.price)}/hr</td>
                    <td className="px-5 py-3 text-muted">{venue.rating}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-dark/10 dark:hover:text-dark"
                          title="Delete"
                          onClick={() => deleteMutation.mutate(venue.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function VenueForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [sport, setSport] = useState('football')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Ahmedabad')
  const [price, setPrice] = useState('500')
  const [weekendPrice, setWeekendPrice] = useState('')
  const [description, setDescription] = useState('')
  const [facilities, setFacilities] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const createMutation = useMutation({
    mutationFn: () => createVenue({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      sport,
      address,
      city: city as Venue['city'],
      price: Number(price) || 0,
      weekendPrice: weekendPrice ? Number(weekendPrice) : undefined,
      images: imageUrl ? [imageUrl] : [],
      facilities: facilities.split(',').map((f) => f.trim()).filter(Boolean),
      slots: [
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
        '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
      ],
      rating: 0,
      reviewCount: 0,
      lat: 0,
      lng: 0,
      description,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] })
      onClose()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createMutation.mutateAsync()
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6 p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-ink dark:text-dark">Add New Venue</h2>
        <button type="button" onClick={onClose} className="rounded-full p-1 text-muted hover:bg-ink/5 dark:hover:bg-dark/10">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Elite Turf" className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Sport</label>
          {/* FIXED: Added text-neutral-900 dark:text-neutral-100 */}
          <select value={sport} onChange={(e) => setSport(e.target.value)} className="h-10 w-full rounded-lg border border-ink/10 bg-white px-3 text-sm text-neutral-900 dark:text-neutral-100 dark:border-dark/10 dark:bg-neutral-900">
            {SPORTS.map((s) => (
              <option key={s.slug} value={s.slug} className="text-neutral-900 dark:text-neutral-100">{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Address</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Near Infocity" className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">City</label>
          {/* FIXED: Added text-neutral-900 dark:text-neutral-100 */}
          <select value={city} onChange={(e) => setCity(e.target.value)} className="h-10 w-full rounded-lg border border-ink/10 bg-white px-3 text-sm text-neutral-900 dark:text-neutral-100 dark:border-dark/10 dark:bg-neutral-900">
            <option value="Ahmedabad" className="text-neutral-900 dark:text-neutral-100">Ahmedabad</option>
            <option value="Gandhinagar" className="text-neutral-900 dark:text-neutral-100">Gandhinagar</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Price (₹/hr)</label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Weekend Price (₹/hr)</label>
          <Input type="number" value={weekendPrice} onChange={(e) => setWeekendPrice(e.target.value)} className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Image URL</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Facilities (comma-separated)</label>
          <Input value={facilities} onChange={(e) => setFacilities(e.target.value)} placeholder="Floodlights, Parking" className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A premium sports facility..." className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? 'Creating...' : 'Create Venue'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </motion.div>
  )
}

// ─── Events Tab ───────────────────────────────────────────────────────────────

function EventsTab() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data: events = [] } = useQuery({ queryKey: ['admin-events'], queryFn: getEvents })
  const { data: venues = [] } = useQuery({ queryKey: ['admin-venues'], queryFn: getVenues })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  })

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.sport.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="pl-10 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900"
          />
        </div>
        <Button variant="accent" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </motion.div>

      {showForm && <EventForm venues={venues} onClose={() => setShowForm(false)} />}

      <motion.div variants={itemVariants} className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No events found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5 text-left text-xs font-medium uppercase tracking-wider text-muted dark:border-dark/5">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Sport</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Fee</th>
                  <th className="px-5 py-3">Slots</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 dark:divide-dark/5">
                {filtered.map((event) => (
                  <tr key={event.id} className="text-sm">
                    <td className="px-5 py-3 font-medium text-ink dark:text-dark">{event.title}</td>
                    <td className="px-5 py-3 text-muted capitalize">{event.sport}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(event.date)}</td>
                    <td className="px-5 py-3 text-ink dark:text-dark">{event.fee === 0 ? 'Free' : formatPrice(event.fee)}</td>
                    <td className="px-5 py-3 text-muted">{event.slots}/{event.maxSlots}</td>
                    <td className="px-5 py-3">
                      <Badge variant={event.status === 'upcoming' ? 'success' : event.status === 'full' ? 'warning' : 'default'}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-dark/10 dark:hover:text-dark"
                          title="Delete"
                          onClick={() => deleteMutation.mutate(event.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function EventForm({ venues, onClose }: { venues: Venue[]; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [sport, setSport] = useState('football')
  const [venueId, setVenueId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [host, setHost] = useState('')
  const [fee, setFee] = useState('0')
  const [maxSlots, setMaxSlots] = useState('10')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const createMutation = useMutation({
    mutationFn: () => {
      const venue = venues.find((v) => v.id === venueId)
      return createEvent({
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        sport,
        venue: venue?.name ?? '',
        venueId,
        date,
        time,
        host,
        hostId: '',
        fee: Number(fee) || 0,
        slots: Number(maxSlots) || 10,
        maxSlots: Number(maxSlots) || 10,
        participants: [],
        description,
        image: venue?.images?.[0] ?? '',
        status: 'upcoming',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] })
      onClose()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createMutation.mutateAsync()
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6 p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-ink dark:text-dark">Add New Event</h2>
        <button type="button" onClick={onClose} className="rounded-full p-1 text-muted hover:bg-ink/5 dark:hover:bg-dark/10">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Saturday Football League" className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Sport</label>
          <select value={sport} onChange={(e) => setSport(e.target.value)} className="h-10 w-full rounded-lg border border-ink/10 bg-white px-3 text-sm text-neutral-900 dark:text-neutral-100 dark:border-dark/10 dark:bg-neutral-900">
            {SPORTS.map((s) => (
              <option key={s.slug} value={s.slug} className="text-neutral-900 dark:text-neutral-100">{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Venue</label>
          <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className="h-10 w-full rounded-lg border border-ink/10 bg-white px-3 text-sm text-neutral-900 dark:text-neutral-100 dark:border-dark/10 dark:bg-neutral-900" required>
            <option value="" className="text-neutral-900 dark:text-neutral-100">Select venue...</option>
            {venues.filter((v) => v.sport === sport).map((v) => (
              <option key={v.id} value={v.id} className="text-neutral-900 dark:text-neutral-100">{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Time</label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Host</label>
          <Input value={host} onChange={(e) => setHost(e.target.value)} required placeholder="Host name" className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Fee (₹)</label>
          <Input type="number" value={fee} onChange={(e) => setFee(e.target.value)} required className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Max Slots</label>
          <Input type="number" value={maxSlots} onChange={(e) => setMaxSlots(e.target.value)} required className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink dark:text-dark">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="About this event..." className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900" />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </motion.div>
  )
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: getAllUsers })
  const { data: bookings = [] } = useQuery({ queryKey: ['admin-bookings'], queryFn: getAllBookings })

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: User['role'] }) => updateUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-10 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5 text-left text-xs font-medium uppercase tracking-wider text-muted dark:border-dark/5">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 dark:divide-dark/5">
                {filtered.map((user) => {
                  const userBookings = bookings.filter((b) => b.userId === user.id)
                  return (
                    <tr key={user.id} className="text-sm">
                      <td className="px-5 py-3 font-medium text-ink dark:text-dark">{user.name}</td>
                      <td className="px-5 py-3 text-muted">{user.email}</td>
                      <td className="px-5 py-3">
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'host' ? 'warning' : 'default'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-muted">{userBookings.length}</td>
                      <td className="px-5 py-3">
                        {/* FIXED: Added text-neutral-900 dark:text-neutral-100 */}
                        <select
                          value={user.role}
                          onChange={(e) => roleMutation.mutate({ userId: user.id, role: e.target.value as User['role'] })}
                          className="h-8 rounded-lg border border-ink/10 bg-white px-2 text-xs text-neutral-900 dark:text-neutral-100 dark:border-dark/10 dark:bg-neutral-900"
                        >
                          <option value="user" className="text-neutral-900 dark:text-neutral-100">user</option>
                          <option value="host" className="text-neutral-900 dark:text-neutral-100">host</option>
                          <option value="admin" className="text-neutral-900 dark:text-neutral-100">admin</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}