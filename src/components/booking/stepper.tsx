import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepperProps {
  steps: string[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      {steps.map((label, i) => {
        const isCompleted = i < current
        const isActive = i === current
        const isUpcoming = i > current

        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? '#7CFF4D'
                    : isActive
                      ? '#0A0A0A'
                      : '#E5E7EB',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.25, ease: 'easeOut' as const }}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors',
                  isCompleted
                    ? 'border-accent text-ink'
                    : isActive
                      ? 'border-ink text-surface dark:border-surface dark:text-ink'
                      : 'border-gray-200 text-gray-400 dark:border-gray-700',
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span className="text-xs font-semibold">{i + 1}</span>
                )}
              </motion.div>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:block',
                  isCompleted
                    ? 'text-ink dark:text-surface'
                    : isActive
                      ? 'text-ink dark:text-surface'
                      : 'text-gray-400',
                )}
              >
                {label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={false}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: 'easeOut' as const }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
