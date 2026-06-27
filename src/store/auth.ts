import { create } from 'zustand'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth'
import { auth, googleProvider } from '@/firebase'
import type { User } from '@/types'

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

export const useAuth = create<AuthState>()((set) => {
  // Directly subscribe to Firebase changes inside the store to avoid custom sync blocks
  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      set({
        user: {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          photo: firebaseUser.photoURL || '',
          phone: '',
          role: 'user',
          createdAt: new Date().toISOString(),
        },
        isAuthenticated: true,
        loading: false,
      })
    } else {
      set({ user: null, isAuthenticated: false, loading: false })
    }
  })

  return {
    user: null,
    isAuthenticated: false,
    loading: true,

    login: async ({ email, password }) => {
      await signInWithEmailAndPassword(auth, email, password)
    },

    register: async ({ email, password }) => {
      await createUserWithEmailAndPassword(auth, email, password)
      // Note: If you want to save the user's name immediately, 
      // you can add `await updateProfile(auth.currentUser, { displayName: name })` here.
    },

    loginWithGoogle: async () => {
      await signInWithPopup(auth, googleProvider)
    },

    logout: async () => {
      await signOut(auth)
    },

    setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  }
})