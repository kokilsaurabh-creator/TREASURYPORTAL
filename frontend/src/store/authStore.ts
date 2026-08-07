import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

export type UserRole = 'Admin' | 'Finance Head' | 'Maker' | 'Authoriser' | 'Auditor' | null
export type EntryRole = 'Admin' | 'User'

export interface UserProfile {
  id?: string
  email: string
  name: string
  department?: string
  entryRole: EntryRole
}

interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  role: UserRole
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setRole: (role: UserRole) => void
  login: (email: string, role: UserRole, name?: string, entryRole?: EntryRole) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  role: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  login: (email, role, name, entryRole = 'User') => {
    const formattedName = name || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase())
    set({
      role,
      isAuthenticated: true,
      userProfile: {
        email,
        name: formattedName,
        entryRole,
        department: role === 'Admin' ? 'IT Administration' : 'Corporate Treasury'
      }
    })
  },
  logout: () => set({ user: null, userProfile: null, role: null, isAuthenticated: false })
}))
