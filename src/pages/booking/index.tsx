import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  Minus,
  Plus,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/store/auth'
import { createBooking, getEvents, bookSlots } from '@/services/db'
import { sendEventJoinEmail } from '@/services/mail'
import { Button, Badge, EmptyState } from '@/components/ui'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import { Stepper } from '@/components/booking/stepper'
import { Confirmation } from '@/components/booking/confirmation'
import type { Event } from '@/types'

const STEPS = ['Select Tournament', 'Select Slots', 'Confirm', 'Done']

type BookingStatus = 'idle' | 'confirmed' | 'failed'

export default function TournamentBookingPage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<number>(1)
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle')
  const [bookingError, setBookingError] = useState<string | null>(null)

  const isAuthenticated = useAuth((s) => s.isAuthenticated)
  const user = useAuth((s) => s.user)
  const queryClient = useQueryClient()

  const urlTournament = searchParams.get('tournament')

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  // Filter to only upcoming tournaments
  const tournaments = useMemo(() => {
    return events.filter((e) => e.status === 'upcoming' || e.status === 'full')
  }, [events])

  const tournament = useMemo(
    () => events.find((t) => t.id === selectedTournament) ?? null,
    [events, selectedTournament],
  )

  function handleSelectTournament(id: string) {
    setSelectedTournament(id)
  }

  async function handleConfirmBooking() {
    if (!user || !tournament) return

    // Check if enough slots available
    if (tournament.slots < selectedSlots) {
      setBookingError(`Only ${tournament.slots} slots available. Please select fewer slots.`)
      return
    }

    // Check if user already joined
    if (tournament.participants?.includes(user.id)) {
      setBookingError('You have already joined this tournament.')
      return
    }

    setBookingError(null)
    setBookingStatus('confirmed')
    const id = generateBookingId()

    try {
      // 1. Create booking record with selected slots
      await createBooking({
        userId: user.id,
        venueId: tournament.venueId,
        date: tournament.date,
        slot: tournament.time,
        hours: 1,
        price: tournament.fee * selectedSlots,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        paymentMethod: 'offline',
        players: selectedSlots,
      })

      // 2. Book slots in tournament (adds user to participants, decrements slots)
      await bookSlots(tournament.id, user.id, selectedSlots)

      // 3. Refresh events data to show updated slots
      queryClient.invalidateQueries({ queryKey: ['events'] })

      setBookingId(id)

      // 4. Send confirmation email
      sendEventJoinEmail(
        { title: tournament.title, date: tournament.date, time: tournament.time, venue: tournament.venue },
        user
      ).catch((err) => console.error('Email failed:', err))
    } catch (err: any) {
      console.error('[Booking] Failed:', err)
      setBookingStatus('failed')
      setBookingError(err?.message || err?.code || 'Failed to book slots. Please try again.')
    }
  }

  function goNext() {
    setDirection(1)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
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

  // Show confirmation when booking is created
  if (bookingId && tournament) {
    return (
      <div className="min-h-screen bg-surface px-6 py-20 dark:bg-ink">
        <div className="mx-auto max-w-2xl">
          <Confirmation
            booking={{
              id: bookingId,
              venueName: tournament.venue,
              sport: tournament.sport,
              date: tournament.date,
              time: tournament.time,
              price: tournament.fee,
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
              Join Tournament
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
            {/* STEP 0: Select Tournament */}
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Select a Tournament
                  </h1>
                  <p className="mt-2 text-muted">
                    Choose a tournament you want to join.
                  </p>
                </div>

                {tournaments.length === 0 ? (
                  <EmptyState
                    icon={Trophy}
                    title="No tournaments available"
                    description="Check back soon — new tournaments are being added."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tournaments.map((t) => {
                      const isSelected = selectedTournament === t.id
                      const isFull = t.status === 'full' || (t.slots ?? 0) <= 0
                      const isJoined = t.participants?.includes(user?.id ?? '')

                      return (
                        <motion.button
                          key={t.id}
                          type="button"
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectTournament(t.id)}
                          disabled={isFull}
                          className={cn(
                            'group relative flex flex-col overflow-hidden rounded-2xl border p-6 text-left transition-all duration-200',
                            isSelected
                              ? 'border-accent ring-2 ring-accent shadow-xl'
                              : isFull
                                ? 'cursor-not-allowed opacity-60 border-ink/10 dark:border-surface/10'
                                : 'border-ink/10 hover:border-accent/50 hover:shadow-lg dark:border-surface/10',
                          )}
                        >
                          <div className="mb-3 flex items-center gap-2">
                            {isJoined ? (
                              <Badge variant="outline">Joined</Badge>
                            ) : (
                              <Badge variant={isFull ? 'danger' : 'success'}>
                                {isFull ? 'Full' : 'Open'}
                              </Badge>
                            )}
                            <span className="text-xs text-muted capitalize">{t.sport}</span>
                          </div>

                          <h3 className="font-heading text-lg font-semibold text-ink dark:text-surface">
                            {t.title}
                          </h3>

                          <div className="mt-2 space-y-1 text-sm text-muted">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(t.date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{t.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{t.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5" />
                              <span>{t.maxSlots - (t.slots ?? 0)} / {t.maxSlots} joined</span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 dark:border-surface/10">
                            <span className="font-heading text-lg font-bold text-accent">
                              {t.fee === 0 ? 'Free' : formatPrice(t.fee)}
                            </span>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-accent" />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: Select Slots */}
            {step === 1 && tournament && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Select Slots
                  </h1>
                  <p className="mt-2 text-muted">
                    How many slots do you want to book for this tournament?
                  </p>
                </div>

                <div className="max-w-lg space-y-6">
                  {/* Tournament Info */}
                  <div className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-surface/10 dark:bg-neutral-900">
                    <h3 className="font-heading text-lg font-semibold text-ink dark:text-surface">{tournament.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
                      <span>{formatDate(tournament.date, { day: 'numeric', month: 'short' })}</span>
                      <span>{tournament.time}</span>
                      <span>{tournament.venue}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-muted">Entry Fee (per slot)</span>
                      <span className="font-heading text-lg font-bold text-accent">
                        {tournament.fee === 0 ? 'Free' : formatPrice(tournament.fee)}
                      </span>
                    </div>
                  </div>

                  {/* Slot Selector */}
                  <div className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-surface/10 dark:bg-neutral-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-ink dark:text-surface">Available Slots</p>
                        <p className="text-2xl font-heading font-bold text-accent">{tournament.slots}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink dark:text-surface">Max Slots</p>
                        <p className="text-2xl font-heading font-bold text-muted">{tournament.maxSlots}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="mb-3 text-sm font-medium text-ink dark:text-surface">How many slots to book?</p>
                      <div className="flex items-center gap-6">
                        <button
                          type="button"
                          onClick={() => setSelectedSlots(Math.max(1, selectedSlots - 1))}
                          disabled={selectedSlots <= 1}
                          className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink/15 bg-white text-ink transition-all hover:bg-ink/5 disabled:opacity-30 dark:border-surface/20 dark:bg-surface/5 dark:text-surface dark:hover:bg-surface/10"
                        >
                          <Minus className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center">
                          <span className="font-heading text-5xl font-bold text-ink dark:text-surface">{selectedSlots}</span>
                          <span className="mt-1 text-sm text-muted">slot{selectedSlots > 1 ? 's' : ''}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedSlots(Math.min(tournament.slots, selectedSlots + 1))}
                          disabled={selectedSlots >= (tournament.slots ?? 1)}
                          className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink/15 bg-white text-ink transition-all hover:bg-ink/5 disabled:opacity-30 dark:border-surface/20 dark:bg-surface/5 dark:text-surface dark:hover:bg-surface/10"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quick select buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].filter(n => n <= (tournament.slots ?? 1)).map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setSelectedSlots(n)}
                            className={cn(
                              'rounded-full px-4 py-2 text-sm font-medium transition-all border',
                              selectedSlots === n
                                ? 'bg-ink text-surface border-ink dark:bg-surface dark:text-ink dark:border-surface'
                                : 'bg-white text-ink border-ink/10 hover:bg-ink/5 dark:bg-neutral-900 dark:text-surface dark:border-surface/10 dark:hover:bg-surface/10',
                            )}
                          >
                            {n} slot{n > 1 ? 's' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-6 border-t border-ink/10 pt-4 dark:border-surface/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Total ({selectedSlots} slot{selectedSlots > 1 ? 's' : ''} × {formatPrice(tournament.fee)})</span>
                        <span className="font-heading text-xl font-bold text-accent">
                          {tournament.fee === 0 ? 'Free' : formatPrice(tournament.fee * selectedSlots)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Confirm & Book */}
            {step === 2 && tournament && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold sm:text-4xl text-ink dark:text-surface">
                    Confirm Booking
                  </h1>
                  <p className="mt-2 text-muted">
                    Review your booking details and confirm.
                  </p>
                </div>

                <div className="max-w-lg space-y-6">
                  {/* Booking Summary */}
                  <div className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-surface/10 dark:bg-neutral-900">
                    <h3 className="font-heading text-lg font-semibold text-ink dark:text-surface">{tournament.title}</h3>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted" />
                        <div>
                          <p className="text-xs text-muted">Date</p>
                          <p className="font-medium text-ink dark:text-surface">
                            {formatDate(tournament.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted" />
                        <div>
                          <p className="text-xs text-muted">Time</p>
                          <p className="font-medium text-ink dark:text-surface">{tournament.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted" />
                        <div>
                          <p className="text-xs text-muted">Venue</p>
                          <p className="font-medium text-ink dark:text-surface">{tournament.venue}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-muted" />
                        <div>
                          <p className="text-xs text-muted">Slots Booked</p>
                          <p className="font-medium text-ink dark:text-surface">{selectedSlots}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-ink/10 pt-4 dark:border-surface/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Total Amount</span>
                        <span className="font-heading text-xl font-bold text-accent">
                          {tournament.fee === 0 ? 'Free' : formatPrice(tournament.fee * selectedSlots)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">Pay at venue • {selectedSlots} slot{selectedSlots > 1 ? 's' : ''} × {formatPrice(tournament.fee)}</p>
                    </div>
                  </div>

                  {/* Error */}
                  {bookingError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                      <p className="text-sm text-red-600 dark:text-red-400">{bookingError}</p>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={bookingStatus === 'confirmed'}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-ink transition-all hover:bg-accent/90 disabled:opacity-60"
                  >
                    {bookingStatus === 'confirmed' ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Booking Confirmed!
                      </>
                    ) : (
                      <>
                        <Wallet className="h-5 w-5" />
                        Confirm & Pay at Venue
                      </>
                    )}
                  </button>

                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>How it works:</strong> Reserve your spots now and pay when you arrive at the venue. You'll receive a confirmation via email.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < STEPS.length - 2 && (
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
              disabled={!selectedTournament}
              className="gap-2"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'KR-'
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}
