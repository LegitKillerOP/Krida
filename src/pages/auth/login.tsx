import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/store/auth'
import { SocialButtons } from '@/components/auth/social-buttons'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      await login(data)
      navigate('/profile')
    } catch (err: any) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate('/profile')
    } catch (err: any) {
      setError(err?.message || 'Google Authentication failed.')
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
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink dark:text-dark">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted">Sign in to your account to continue playing</p>
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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink dark:text-dark">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input {...register('password')} type="password" placeholder="Enter your password" className="pl-10" />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="h-4 w-4 rounded border-ink/20 accent-ink focus:ring-accent/40" />
                Remember me
              </label>
              <Link to="/forgot" className="text-sm font-medium text-ink underline-offset-4 hover:underline dark:text-dark">
                Forgot password?
              </Link>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">
                {error}
              </motion.p>
            )}

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-ink/10 dark:bg-surface/10" />
            <span className="text-xs text-muted">Or continue with</span>
            <div className="h-px flex-1 bg-ink/10 dark:bg-surface/10" />
          </div>

          <SocialButtons onGoogleClick={handleGoogleLogin} />

          <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-ink underline-offset-4 hover:underline dark:text-dark">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}