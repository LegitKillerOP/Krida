import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type ForgotForm = z.infer<typeof forgotSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function ForgotPage() {
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true)
    setError('')
    try {
      await sendPasswordResetEmail(auth, data.email)
      setEmailSent(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link. Please check the email entry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={itemVariants} className="card p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {!emailSent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-8 text-center">
                  <Link to="/" className="mb-6 inline-block">
                    <span className="font-heading text-2xl font-bold tracking-tight text-ink">KRIDA</span>
                  </Link>
                  <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink dark:text-dark">
                    Forgot password?
                  </h1>
                  <p className="mt-2 text-sm text-muted">No worries, we'll send you reset instructions</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink dark:text-dark">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <Input {...register('email')} type="email" placeholder="you@example.com" className="pl-10" />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Sending reset link...' : 'Send reset link'}
                  </Button>
                </form>

                <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink dark:hover:text-dark">
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-4 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
                  <CheckCircle className="h-8 w-8 text-ink dark:text-accent" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-ink dark:text-dark">Check your email</h2>
                <p className="mt-2 text-sm text-muted">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                </p>
                <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:underline dark:text-dark">
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}