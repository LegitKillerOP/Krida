import { Target, Swords, Zap, Activity } from 'lucide-react'

export const SPORTS = [
  {
    slug: 'football',
    name: 'Football',
    icon: 'Football',
    tagline: '5-a-side & 7-a-side turfs',
    description: 'Book premium football turfs across Gandhinagar & Ahmedabad. From casual kickabouts to competitive matches.',
  },
  {
    slug: 'cricket',
    name: 'Cricket',
    icon: 'Target',
    tagline: 'Box cricket & open grounds',
    description: 'Box cricket nets, open grounds, and community matches for every skill level.',
  },
  {
    slug: 'badminton',
    name: 'Badminton',
    icon: 'Badminton',
    tagline: 'Indoor courts, pro flooring',
    description: 'Professional indoor courts with wooden or synthetic flooring for singles and doubles.',
  },
  {
    slug: 'pickleball',
    name: 'Pickleball',
    icon: 'Zap',
    tagline: 'Fastest-growing sport',
    description: 'Dedicated pickleball courts with the right surface and net height for competitive play.',
  },
  {
    slug: 'running',
    name: 'Running',
    icon: 'Activity',
    tagline: 'Tracks & community groups',
    description: 'Morning running groups, track sessions, and weekly challenges across both cities.',
  },
] as const

export type SportSlug = (typeof SPORTS)[number]['slug']

export const NAV_LINKS = [
  { label: 'Sports', to: '/sports' },
  { label: 'Venues', to: '/venues' },
  { label: 'Events', to: '/events' },
  { label: 'Book', to: '/booking' },
]

export const FOOTER_LINKS = {
  sports: [
    { label: 'Football', to: '/sports/football' },
    { label: 'Cricket', to: '/sports/cricket' },
    { label: 'Badminton', to: '/sports/badminton' },
    { label: 'Pickleball', to: '/sports/pickleball' },
    { label: 'Running', to: '/sports/running' },
  ],
  company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Careers', to: '/careers' },
  ],
  legal: [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
  ],
}