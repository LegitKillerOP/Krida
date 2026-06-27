import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup
} from 'firebase/auth'
import { getUser, createUser } from '@/services/db'
import type { User } from '@/types'

// Lazy module cache to avoid circular dependency / module ordering issues
let _firebaseModule: any = null

async function getFirebase() {
  if (!_firebaseModule) {
    _firebaseModule = await import('@/firebase')
  }
  return _firebaseModule
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (data: { email: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  setUser: (u: User | null) => void
}

export async function logout() {
  const { auth } = await getFirebase()
  await signOut(auth)
}

export const useAuth = create<AuthState>()((set) => {
  // Lazily subscribe to Firebase auth state
  let _subscribed = false
  if (!_subscribed) {
    _subscribed = true
    getFirebase().then(({ auth }) => {
      auth.onAuthStateChanged(async (firebaseUser: any) => {
        if (firebaseUser) {
          let role: User['role'] = 'user'
          try {
            const dbUser = await getUser(firebaseUser.uid)
            if (dbUser?.role) {
              role = dbUser.role
            }
          } catch {
            // ignore — use default role
          }

          set({
            user: {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              photo: firebaseUser.photoURL || '',
              phone: '',
              role,
              createdAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            loading: false,
          })
        } else {
          set({ user: null, isAuthenticated: false, loading: false })
        }
      })
    })
  }

  return {
    user: null,
    isAuthenticated: false,
    loading: true,

    login: async ({ email, password }) => {
      const { auth } = await getFirebase()
      await signInWithEmailAndPassword(auth, email, password)
    },

    register: async ({ name, email, password }) => {
      const { auth } = await getFirebase()

      // Create Firebase Auth account
      const credential = await createUserWithEmailAndPassword(auth, email, password)

      // Save user to Realtime Database so admins can manage them
      await createUser({
        id: credential.user.uid,
        name,
        email,
        photo: '',
        phone: '',
        role: 'user',
        createdAt: new Date().toISOString(),
      })
    },

    loginWithGoogle: async () => {
      const { auth, googleProvider } = await getFirebase()
      await signInWithPopup(auth, googleProvider)
    },

    logout,

    setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  }
})
