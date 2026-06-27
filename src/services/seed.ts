/**
 * Seed script — run once to populate the Firebase Realtime Database.
 * Execute with: `npx tsx src/services/seed.ts` from the project root.
 *
 * This script only seeds the admin user. Venues, events, sports, and reviews
 * are managed through the admin dashboard.
 */
import { database } from './firebase-admin.js'
import { ref, set } from 'firebase/database'

const adminUser = {
  id: 'admin_001',
  name: 'Admin KRIDA',
  email: 'admin@krida.app',
  photo: '',
  phone: '',
  role: 'admin' as const,
  createdAt: '2025-01-01T00:00:00Z',
}

async function main() {
  console.log('Seeding admin user...')

  const { id, ...adminData } = adminUser
  const userRef = ref(database, `users/${id}`)

  // Use a timeout to prevent hanging
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out after 10s')), 10000)
  )

  await Promise.race([
    set(userRef, adminData),
    timeout,
  ])

  console.log('Admin user seeded successfully!')
  console.log('  ID:', id)
  console.log('  Email:', adminUser.email)
  console.log('  Role: admin')
  console.log('')
  console.log('NOTE: Venues, events, sports, and reviews are managed through the admin dashboard.')
  console.log('Login as admin and use the Venues, Events, and Users tabs to add content.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err.message)
    process.exit(1)
  })
