import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout'
import HomePage from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'

const SportsPage = lazy(() => import('@/pages/sports/index'))
const SportDetailPage = lazy(() => import('@/pages/sports/[slug]'))
const VenuesPage = lazy(() => import('@/pages/venues/index'))
const VenueDetailPage = lazy(() => import('@/pages/venues/[id]'))
const EventsPage = lazy(() => import('@/pages/events/index'))
const EventDetailPage = lazy(() => import('@/pages/events/[id]'))
const BookingPage = lazy(() => import('@/pages/booking/index'))
const LoginPage = lazy(() => import('@/pages/auth/login'))
const RegisterPage = lazy(() => import('@/pages/auth/register'))
const ForgotPage = lazy(() => import('@/pages/auth/forgot'))
const ProfilePage = lazy(() => import('@/pages/profile/index'))
const AdminPage = lazy(() => import('@/pages/admin/index'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
})

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink dark:border-surface/20 dark:border-t-surface" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/sports" element={<SportsPage />} />
              <Route path="/sports/:slug" element={<SportDetailPage />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/venues/:id" element={<VenueDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/:venueId" element={<BookingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot" element={<ForgotPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
