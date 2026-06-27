import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/store/auth'
import { SocialButtons } from '@/components/auth/social-buttons'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    terms: z.literal(true, { error: 'You must accept the terms' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false as unknown as true },
  })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password })
      navigate('/profile')
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate('/profile')
    } catch (err: any) {
      setError(err?.message || 'Google Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={itemVariants} className="card p-8 sm:p-10">
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-ink">KRIDA</span>
            </Link>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink dark:text-black">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted">Join KRIDA and start booking your favorite sports</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink dark:text-dark">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input {...register('name')} type="text" placeholder="Aarav Patel" className="pl-10" />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink dark:text-dark">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input {...register('email')} type="email" placeholder="you@example.com" className="pl-10" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink dark:text-dark">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input {...register('password')} type="password" placeholder="Create a strong password" className="pl-10" />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink dark:text-dark">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input {...register('confirmPassword')} type="password" placeholder="Confirm your password" className="pl-10" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-muted">
                <input {...register('terms')} type="checkbox" className="mt-0.5 h-4 w-4 rounded border-ink/20 accent-ink focus:ring-accent/40" />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-ink underline hover:underline dark:text-dark">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="text-ink underline hover:underline dark:text-dark">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">
                {error}
              </motion.p>
            )}

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-ink/10 dark:bg-surface/10" />
            <span className="text-xs text-muted">Or sign up with</span>
            <div className="h-px flex-1 bg-ink/10 dark:bg-surface/10" />
          </div>

          <SocialButtons onGoogleClick={handleGoogleSignUp} />

          <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-ink underline-offset-4 hover:underline dark:text-dark">
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}