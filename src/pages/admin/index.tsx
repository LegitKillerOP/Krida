import { motion } from 'framer-motion'
import {
  DollarSign,
  Calendar,
  Tent,
  MapPin,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'

const stats = [
  { label: 'Revenue', value: '₹1,24,500', icon: DollarSign, change: '+12.5%', positive: true },
  { label: 'Bookings', value: '187', icon: Calendar, change: '+8.2%', positive: true },
  { label: 'Events', value: '12', icon: Tent, change: '+3', positive: true },
  { label: 'Venues', value: '40', icon: MapPin, change: '+2', positive: true },
]

const recentBookings = [
  { id: 'b_001', venue: 'Elite Turf', user: 'Aarav Patel', date: '2026-06-27', amount: 2400, status: 'confirmed' },
  { id: 'b_002', venue: 'Smash Arena', user: 'Priya Mehta', date: '2026-06-27', amount: 600, status: 'pending' },
  { id: 'b_003', venue: 'The Cricket Box', user: 'Vikram Desai', date: '2026-06-26', amount: 2000, status: 'confirmed' },
  { id: 'b_004', venue: 'PickleHub', user: 'Sneha Joshi', date: '2026-06-26', amount: 800, status: 'cancelled' },
  { id: 'b_005', venue: 'Goal Zone Turf', user: 'Karan Singh', date: '2026-06-25', amount: 1400, status: 'confirmed' },
]

const barData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 80 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 95 },
  { day: 'Sun', value: 55 },
]

const topSports = [
  { name: 'Football', percentage: 85, color: 'bg-ink dark:bg-surface' },
  { name: 'Cricket', percentage: 70, color: 'bg-ink/80 dark:bg-surface/80' },
  { name: 'Badminton', percentage: 55, color: 'bg-ink/60 dark:bg-surface/60' },
  { name: 'Pickleball', percentage: 40, color: 'bg-ink/40 dark:bg-surface/40' },
  { name: 'Running', percentage: 30, color: 'bg-ink/20 dark:bg-surface/20' },
]
/* In dark mode, surface=#0A0A0A (dark) and ink=#FAFAFA (light), so progress bars
   should use the light color. We swap: bg-ink -> bg-surface, bg-surface -> bg-ink */

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

export default function AdminPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink dark:text-surface sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-muted">
              Overview of your sports booking platform performance
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                      <Icon className="h-5 w-5 text-ink dark:text-accent" />
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        stat.positive
                          ? 'text-ink dark:text-accent'
                          : 'text-red-500'
                      }`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-4 font-heading text-2xl font-bold text-ink dark:text-surface">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              )
            })}
          </motion.div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Bookings Table */}
            <motion.div variants={itemVariants} className="card overflow-hidden lg:col-span-2">
              <div className="border-b border-ink/5 p-6 dark:border-surface/5">
                <h2 className="font-heading text-lg font-semibold text-ink dark:text-surface">
                  Recent Bookings
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ink/5 text-left text-xs font-medium uppercase tracking-wider text-muted dark:border-surface/5">
                      <th className="px-6 py-3">Venue</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5 dark:divide-surface/5">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="text-sm">
                        <td className="px-6 py-4 font-medium text-ink dark:text-surface">
                          {booking.venue}
                        </td>
                        <td className="px-6 py-4 text-muted">{booking.user}</td>
                        <td className="px-6 py-4 text-muted">{formatDate(booking.date)}</td>
                        <td className="px-6 py-4 font-medium text-ink dark:text-surface">
                          {formatPrice(booking.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'success'
                                : booking.status === 'pending'
                                  ? 'warning'
                                  : 'danger'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Today's Revenue */}
              <motion.div variants={itemVariants} className="card p-6">
                <h2 className="font-heading text-lg font-semibold text-ink dark:text-surface">
                  Today's Revenue
                </h2>
                <p className="mt-1 text-sm text-muted">Hourly breakdown</p>
                <div className="mt-6 flex h-40 items-end gap-2">
                  {barData.map((bar) => (
                    <div key={bar.day} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-md bg-ink transition-all duration-500 dark:bg-surface"
                        style={{ height: `${bar.value}%` }}
                      />
                      <span className="text-[10px] text-muted">{bar.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted">Peak</span>
                  <span className="font-heading font-semibold text-ink dark:text-surface">
                    ₹18,500
                  </span>
                </div>
              </motion.div>

              {/* Occupancy Rate */}
              <motion.div variants={itemVariants} className="card p-6">
                <h2 className="font-heading text-lg font-semibold text-ink dark:text-surface">
                  Occupancy Rate
                </h2>
                <p className="mt-1 text-sm text-muted">This week</p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative h-36 w-36">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-ink/10 dark:text-surface/10"
                      />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={314}
                        initial={{ strokeDashoffset: 314 }}
                        animate={{ strokeDashoffset: 314 * (1 - 0.73) }}
                        transition={{ duration: 1.2, ease: 'easeOut' as const, delay: 0.3 }}
                        className="text-ink dark:text-accent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-heading text-3xl font-bold text-ink dark:text-surface">
                        73%
                      </span>
                      <span className="text-xs text-muted">occupied</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Top Sports */}
              <motion.div variants={itemVariants} className="card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-semibold text-ink dark:text-surface">
                    Top Sports
                  </h2>
                  <Users className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-5 space-y-4">
                  {topSports.map((sport) => (
                    <div key={sport.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-ink dark:text-surface">
                          {sport.name}
                        </span>
                        <span className="text-muted">{sport.percentage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-surface/10">
                        <motion.div
                          className={`h-full rounded-full ${sport.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${sport.percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' as const, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
