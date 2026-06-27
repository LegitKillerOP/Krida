import { Hero } from '@/components/home/hero'
import { Features } from '@/components/home/features'
import { Sports } from '@/components/home/sports'
import { Venues } from '@/components/home/venues'
import { Events } from '@/components/home/events'
import { Community } from '@/components/home/community'
import { Testimonials } from '@/components/home/testimonials'
import { CTA } from '@/components/home/cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Sports />
      <Venues />
      <Events />
      <Community />
      <Testimonials />
      <CTA />
    </>
  )
}
