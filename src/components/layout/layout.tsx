import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { ScrollToTop } from './scroll-to-top'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink dark:bg-ink dark:text-surface">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
