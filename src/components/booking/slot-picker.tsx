import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'

interface SlotPickerProps {
  selected: string | null
  onSelect: (slot: string) => void
}

const ALL_SLOTS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
]

const UNAVAILABLE_SLOTS = ['7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM']

// Simulated booked slots (deterministic mock)
const BOOKED_SLOTS = ['10:00 AM', '02:00 PM', '08:00 PM']

function getSlotStatus(slot: string): 'available' | 'unavailable' | 'booked' {
  if (UNAVAILABLE_SLOTS.includes(slot)) return 'unavailable'
  if (BOOKED_SLOTS.includes(slot)) return 'booked'
  return 'available'
}

export function SlotPicker({ selected, onSelect }: SlotPickerProps) {
  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-ink/10 bg-white dark:border-surface/20 dark:bg-surface/10" />
          <span className="text-xs text-muted">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-ink dark:bg-surface" />
          <span className="text-xs text-muted">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-100" />
          <Badge variant="danger" className="h-4 w-4 p-0" />
          <span className="text-xs text-muted">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-100" />
          <span className="text-xs text-muted">Unavailable</span>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {ALL_SLOTS.map((slot) => {
          const status = getSlotStatus(slot)
          const isSelected = selected === slot

          return (
            <button
              key={slot}
              type="button"
              disabled={status === 'unavailable' || status === 'booked'}
              onClick={() => {
                if (status === 'available') onSelect(slot)
              }}
              className={cn(
                'rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                isSelected
                  ? 'bg-ink text-surface shadow-lg dark:bg-surface dark:text-ink'
                  : status === 'available'
                    ? 'bg-white text-ink hover:bg-ink/5 border border-ink/10 dark:bg-surface/10 dark:text-surface dark:border-surface/10 dark:hover:bg-surface/10'
                    : status === 'booked'
                      ? 'cursor-not-allowed bg-red-50 text-red-400 line-through dark:bg-red-950/30 dark:text-red-400/60'
                      : 'cursor-not-allowed bg-gray-100 text-gray-400 line-through dark:bg-gray-800/50 dark:text-gray-600',
              )}
            >
              {slot}
            </button>
          )
        })}
      </div>
    </div>
  )
}
