import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Volleyball,
  Target,
  Zap,
  Activity,
  BadgeCheck,
  ShieldCheck,
  Users,
  Minus,
  Plus,
  CalendarDays,
  Wallet,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { useBooking } from '@/store/booking'
import { useAuth } from '@/store/auth'
import { SPORTS, type SportSlug } from '@/lib/constants'
import { getVenues, createBooking } from '@/services/db'
import { sendBookingReceipt } from '@/services/mail'
import { Button, Badge, EmptyState } from '@/components/ui'
import { cn, formatPrice, todayISO } from '@/lib/utils'
import { Stepper } from '@/components/booking/stepper'
import { SlotPicker } from '@/components/booking/slot-picker'
import { Summary } from '@/components/booking/summary'
import { Confirmation } from '@/components/booking/confirmation'

const STEPS = ['Sport', 'Venue', 'Date', 'Time', 'Players', 'Summary', 'Payment', 'Done']

const SPORT_ICONS: Record<string, LucideIcon> = {
  football: Volleyball,
  cricket: Target,
  badminton: Volleyball,
  pickleball: Zap,
  running: Activity,
}

const CONVENIENCE_FEE = 49

function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'KR-'
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

type PaymentStatus = 'idle' | 'confirmed' | 'failed'

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')

  const sport = useBooking((s) => s.sport)
  const venue = useBooking((s) => s.venue)
  const date = useBooking((s) => s.date)
  const slot = useBooking((s) => s.slot)
  const hours = useBooking((s) => s.hours)
  const players = useBooking((s) => s.players)
  const setSport = useBooking((s) => s.setSport)
  const setVenue = useBooking((s) => s.setVenue)
  const setDate = useBooking((s) => s.setDate)
  const setSlot = useBooking((s) => s.setSlot)
  const setHours = useBooking((s) => s.setHours)
  const setPlayers = useBooking((s) => s.setPlayers)

  const isAuthenticated = useAuth((s) => s.isAuthenticated)
  const user = useAuth((s) => s.user)

  const urlSport = searchParams.get('sport') as SportSlug | null
  const urlVenue = searchParams.get('venue')

  const { data: allVenues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
  })

  useEffect(() => {
    if (urlSport && SPORTS.some((s) => s.slug === urlSport)) {
      setSport(urlSport)
      setStep(1)
    }
  }, [])

  useEffect(() => {
    if (urlVenue && allVenues.some((v) => v.id === urlVenue)) {
      const v = allVenues.find((v) => v.id === urlVenue)
      if (v) {
        setSport(v.sport)
        setVenue(v.id)
        setStep(2)
      }
    }
  }, [urlVenue, allVenues])

  const filteredVenues = useMemo(
    () => (sport ? allVenues.filter((v) => v.sport === sport) : []),
    [sport, allVenues],
  )

  const selectedVenue = useMemo(
    () => allVenues.find((v) => v.id === venue) ?? null,
    [venue, allVenues],
  )

  const selectedSportMeta = useMemo(
    () => SPORTS.find((s) => s.slug === sport) ?? null,
    [sport],
  )

  const selectedSportIcon = selectedSportMeta
    ? SPORT_ICONS[selectedSportMeta.slug] ?? Volleyball
    : Volleyball

  const pricePerHour = selectedVenue?.price ?? 0
  const totalPrice = pricePerHour * hours
  const grandTotal = totalPrice + CONVENIENCE_FEE

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return sport !== null
      case 1:
        return venue !== null
      case 2:
        return date.length > 0
      case 3:
        return slot !== null
      case 4:
        return players >= 1 && players <= 20
      case 5:
        return true
      case 6:
        return paymentStatus === 'confirmed'
      default:
        return true
    }
  }

  async function handleConfirmBooking() {
    if (!user || !selectedVenue || !slot) return

    setPaymentStatus('confirmed')
    const id = generateBookingId()

    // Create booking in database with offline/cash payment
    await createBooking({
      userId: user.id,
      venueId: selectedVenue.id,
      date,
      slot,
      hours,
      price: grandTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentMethod: 'cash',
    })

    setBookingId(id)

    // Send receipt email (fire and forget — handled by Firebase extension)
    sendBookingReceipt(
      { id, userId: user.id, venueId: selectedVenue.id, date, slot, hours, price: grandTotal, status: 'pending', createdAt: new Date().toISOString(), paymentMethod: 'cash' },
      selectedVenue,
      user
    ).catch((err) => console.error('Email failed:', err))
  }

  function goNext() {
    if (step === 6 && paymentStatus !== 'confirmed') return
    setDirection(1)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleSelectSport(slug: string) {
    setSport(slug)
    setVenue(null)
    setSlot(null)
  }

  function handleSelectVenue(venueId: string) {
    setVenue(venueId)
    setSlot(null)
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  if (step === STEPS.length - 1 && bookingId && selectedVenue && selectedSportMeta && slot) {
    return (
      <div className="min-h-screen bg-surface px-6 py-20 dark:bg-ink">
        <div className="mx-auto max-w-2xl">
          <Confirmation
            booking={{
              id: bookingId,
              venueName: selectedVenue.name,
              sport: selectedSportMeta.name,
              date,
              time: slot,
              price: grandTotal,
            }}
            userEmail={user?.email}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-ink dark:bg-ink dark:text-surface">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-ink/10 bg-surface/80 backdrop-blur-xl dark:border-surface/10 dark:bg-ink/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink disabled:opacity-30 dark:hover:text-surface"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <p className="font-heading text-sm font-semibold text-ink dark:text-surface">
              Book a Venue
            </p>
            <div className="text-xs font-semibold text-ink dark:text-surface bg-ink/5 dark:bg-surface/10 px-2 py-1 rounded-md">
              Step {step + 1} / {STEPS.length}
            </div>
          </div>

          <div className="mt-4">
            <Stepper steps={STEPS} current={step} />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* STEP 0: Select Sport */}
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Select Your Sport
                  </h1>
                  <p className="mt-2 text-muted">
                    Choose the sport you want to play. We have the best venues across Gandhinagar & Ahmedabad.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SPORTS.map((s) => {
                    const Icon = SPORT_ICONS[s.slug] ?? Volleyball
                    const isSelected = sport === s.slug
                    const venueCount = allVenues.filter((v) => v.sport === s.slug).length

                    return (
                      <motion.button
                        key={s.slug}
                        type="button"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectSport(s.slug)}
                        className={cn(
                          'group relative flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-200 shadow-sm bg-neutral-900 text-white',
                          isSelected
                            ? 'border-accent ring-2 ring-accent shadow-xl'
                            : 'border-surface/10 hover:border-surface/30 hover:shadow-lg',
                        )}
                      >
                        <div
                          className={cn(
                            'mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                            isSelected
                              ? 'bg-accent text-ink'
                              : 'bg-surface/10 text-surface group-hover:bg-accent/10',
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-white">
                          {s.name}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-300">
                          {s.tagline}
                        </p>
                        <p className="mt-3 text-xs text-neutral-400">
                          {venueCount} venue{venueCount !== 1 ? 's' : ''} available
                        </p>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-4"
                          >
                            <BadgeCheck className="h-6 w-6 text-accent" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 1: Select Venue */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Select Venue
                  </h1>
                  <p className="mt-2 text-muted">
                    Choose from {filteredVenues.length} {selectedSportMeta?.name ?? ''} venue{filteredVenues.length !== 1 ? 's' : ''}.
                  </p>
                </div>

                {filteredVenues.length === 0 ? (
                  <EmptyState
                    icon={selectedSportIcon}
                    title="No venues found"
                    description="No venues available for this sport yet."
                    action={{ label: 'Choose another sport', onClick: () => setStep(0) }}
                  />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredVenues.map((v) => {
                      const Icon = SPORT_ICONS[v.sport] ?? Volleyball
                      const isSelected = venue === v.id

                      return (
                        <motion.button
                          key={v.id}
                          type="button"
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectVenue(v.id)}
                          className={cn(
                            'group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 bg-neutral-900 text-white',
                            isSelected
                              ? 'border-accent ring-2 ring-accent shadow-xl'
                              : 'border-surface/10 hover:border-surface/30 hover:shadow-lg',
                          )}
                        >
                          <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-neutral-950 to-neutral-800 w-full">
                            <Icon className="h-14 w-14 text-surface/20" />
                            <div className="absolute left-3 top-3">
                              <Badge className="bg-surface/10 text-white backdrop-blur border-none">
                                {v.city}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-3 p-5 w-full">
                            <h3 className="font-heading text-base font-semibold text-white">
                              {v.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-300">
                              <span>{v.address}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-3 border-surface/10 text-white">
                              <span className="text-sm font-medium opacity-90">
                                {v.rating.toFixed(1)} ({v.reviewCount})
                              </span>
                              <span className="font-heading text-base font-semibold text-accent">
                                {v.price === 0 ? 'Free' : `${formatPrice(v.price)}/hr`}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-3"
                            >
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent">
                                <BadgeCheck className="h-5 w-5 text-ink" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Select Date */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Select Date
                  </h1>
                  <p className="mt-2 text-muted">
                    Pick your preferred date for the booking.
                  </p>
                </div>

                <div className="max-w-md">
                  <label
                    htmlFor="booking-date"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-ink dark:text-surface"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Booking Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    value={date}
                    min={todayISO()}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base font-medium text-ink transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 dark:border-surface/20 dark:bg-neutral-900 dark:text-surface"
                  />
                  <p className="mt-2 text-xs text-muted">
                    Bookings available from today onwards.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Select Time Slot */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Select Time Slot
                  </h1>
                  <p className="mt-2 text-muted">
                    Choose an available time slot for {date}.
                  </p>
                </div>

                <SlotPicker selected={slot} onSelect={setSlot} />
              </div>
            )}

            {/* STEP 4: Number of Players */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Number of Players
                  </h1>
                  <p className="mt-2 text-muted">
                    How many players will be joining? (Max 20)
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setPlayers(Math.max(1, players - 1))}
                    disabled={players <= 1}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink/15 bg-white text-ink transition-all hover:bg-ink/5 disabled:opacity-30 dark:border-surface/20 dark:bg-surface/5 dark:text-surface dark:hover:bg-surface/10"
                  >
                    <Minus className="h-5 w-5" />
                  </button>

                  <div className="flex flex-col items-center">
                    <Users className="mb-2 h-5 w-5 text-muted" />
                    <motion.span
                      key={players}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-heading text-5xl font-bold text-ink dark:text-surface"
                    >
                      {players}
                    </motion.span>
                    <span className="mt-1 text-sm text-muted">
                      Player{players > 1 ? 's' : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPlayers(Math.min(20, players + 1))}
                    disabled={players >= 20}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink/15 bg-white text-ink transition-all hover:bg-ink/5 disabled:opacity-30 dark:border-surface/20 dark:bg-surface/5 dark:text-surface dark:hover:bg-surface/10"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[2, 4, 6, 8, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPlayers(n)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition-all border',
                        players === n
                          ? 'bg-ink text-surface border-ink dark:bg-surface dark:text-ink dark:border-surface'
                          : 'bg-white text-ink border-ink/10 hover:bg-ink/5 dark:bg-neutral-900 dark:text-surface dark:border-surface/10 dark:hover:bg-surface/10',
                      )}
                    >
                      {n} players
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Booking Summary */}
            {step === 5 && selectedVenue && selectedSportMeta && (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <div>
                    <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                      Booking Summary
                    </h1>
                    <p className="mt-2 text-muted">
                      Review your booking details before proceeding to payment.
                    </p>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6 dark:border-surface/10 dark:bg-neutral-900">
                    <div className="flex items-center gap-4 border-b border-ink/10 pb-4 dark:border-surface/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink/5 dark:bg-surface/10">
                        {(() => {
                          const Icon = SPORT_ICONS[selectedSportMeta.slug] ?? Volleyball
                          return <Icon className="h-6 w-6 text-ink dark:text-surface" />
                        })()}
                      </div>
                      <div>
                        <p className="font-heading text-lg font-semibold text-ink dark:text-surface">
                          {selectedVenue.name}
                        </p>
                        <p className="text-sm text-muted capitalize">
                          {selectedSportMeta.name} - {selectedVenue.city}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted">Date</p>
                        <p className="text-sm font-medium text-ink dark:text-surface">{date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Time</p>
                        <p className="text-sm font-medium text-ink dark:text-surface">{slot}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Duration</p>
                        <p className="text-sm font-medium text-ink dark:text-surface">{hours} hour{hours > 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Players</p>
                        <p className="text-sm font-medium text-ink dark:text-surface">{players} player{players > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Summary
                    venueName={selectedVenue.name}
                    sport={selectedSportMeta.name}
                    date={date}
                    time={slot ?? ''}
                    hours={hours}
                    players={players}
                    pricePerHour={pricePerHour}
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Confirm & Pay at Venue */}
            {step === 6 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Confirm Booking
                  </h1>
                  <p className="mt-2 text-muted">
                    Pay at the venue when you arrive.
                  </p>
                </div>

                <div className="max-w-lg space-y-6">
                  {/* Payment Summary */}
                  <div className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-surface/10 dark:bg-neutral-900">
                    <h3 className="font-heading text-base font-semibold text-ink dark:text-surface">Payment Summary</h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Venue price ({hours} hr{hours > 1 ? 's' : ''})</span>
                        <span className="font-medium text-ink dark:text-surface">{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Convenience fee</span>
                        <span className="font-medium text-ink dark:text-surface">{formatPrice(CONVENIENCE_FEE)}</span>
                      </div>
                      <div className="border-t border-ink/10 pt-3 dark:border-surface/10">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-base font-semibold text-ink dark:text-surface">Total</span>
                          <span className="font-heading text-xl font-bold text-accent">{formatPrice(grandTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  {paymentStatus === 'confirmed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Booking confirmed!</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Pay {formatPrice(grandTotal)} at the venue</p>
                      </div>
                    </motion.div>
                  )}

                  {paymentStatus === 'failed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30"
                    >
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">Something went wrong</p>
                        <p className="text-xs text-red-600 dark:text-red-400">Please try again.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Confirm Button */}
                  {paymentStatus !== 'confirmed' && (
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-ink transition-all hover:bg-accent/90"
                    >
                      <Wallet className="h-5 w-5" />
                      Confirm & Pay at Venue
                    </button>
                  )}

                  {/* Info */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>How it works:</strong> Reserve your slot now and pay when you arrive at the venue. You'll receive a receipt via email.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    <span>Booking confirmed instantly — no online payment needed</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < STEPS.length - 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-ink/10 pt-6 dark:border-surface/10">
            <Button
              variant="outline"
              size="lg"
              onClick={goBack}
              disabled={step === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              variant="accent"
              size="lg"
              onClick={goNext}
              disabled={!canAdvance()}
              className="gap-2"
            >
              {step === STEPS.length - 2 ? 'Done' : step === 6 ? 'Skip' : 'Continue'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
