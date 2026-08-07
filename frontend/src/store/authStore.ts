import { create } from 'zustand'

export type UserRole = 'Admin' | 'Finance Head' | 'Maker' | 'Authoriser' | 'Auditor'

export interface UserAccount {
  userId: string
  passwordHash: string
  fullName: string
  role: UserRole
  department: string
  isActive: boolean
}

const INITIAL_USERS: UserAccount[] = [
  { userId: 'ADMIN', passwordHash: 'Admin@123', fullName: 'System Administrator', role: 'Admin', department: 'IT & Governance', isActive: true },
  { userId: 'FINANCE01', passwordHash: 'Finance@123', fullName: 'Eleanor Vance', role: 'Finance Head', department: 'Corporate Finance', isActive: true },
  { userId: 'MAKER01', passwordHash: 'Maker@123', fullName: 'Marcus Sterling', role: 'Maker', department: 'Treasury Operations', isActive: true },
  { userId: 'AUTH01', passwordHash: 'Auth@123', fullName: 'Sophia Chen', role: 'Authoriser', department: 'Risk & Approvals', isActive: true },
  { userId: 'AUDIT01', passwordHash: 'Audit@123', fullName: 'David Miller', role: 'Auditor', department: 'Internal Audit', isActive: true },
]

interface AuthState {
  userProfile: UserAccount | null
  role: UserRole | null
  isAuthenticated: boolean
  userDirectory: UserAccount[]
  
  login: (userIdInput: string, passwordInput: string) => { success: boolean; message?: string }
  logout: () => void
  addUser: (newUser: Omit<UserAccount, 'isActive'>) => { success: boolean; message: string }
  resetPassword: (userId: string, newPassword: string) => { success: boolean; message: string }
  toggleUserStatus: (userId: string) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userProfile: null,
  role: null,
  isAuthenticated: false,
  userDirectory: INITIAL_USERS,

  login: (userIdInput, passwordInput) => {
    const cleanId = userIdInput.trim().toUpperCase()
    const user = get().userDirectory.find(
      (u) => u.userId.toUpperCase() === cleanId
    )

    if (!user) {
      return { success: false, message: 'Invalid User ID. User account not found.' }
    }

    if (!user.isActive) {
      return { success: false, message: 'This user account is currently deactivated. Contact Administrator.' }
    }

    if (user.passwordHash !== passwordInput) {
      return { success: false, message: 'Incorrect Password. Please try again.' }
    }

    set({
      userProfile: user,
      role: user.role,
      isAuthenticated: true
    })

    return { success: true }
  },

  logout: () => set({ userProfile: null, role: null, isAuthenticated: false }),

  addUser: (newUser) => {
    const cleanId = newUser.userId.trim().toUpperCase()
    const existing = get().userDirectory.find(u => u.userId.toUpperCase() === cleanId)

    if (existing) {
      return { success: false, message: `User ID "${cleanId}" already exists.` }
    }

    const createdUser: UserAccount = {
      ...newUser,
      userId: cleanId,
      isActive: true
    }

    set(state => ({
      userDirectory: [...state.userDirectory, createdUser]
    }))

    return { success: true, message: `User account "${cleanId}" provisioned successfully.` }
  },

  resetPassword: (userId, newPassword) => {
    const cleanId = userId.trim().toUpperCase()
    let updated = false

    set(state => ({
      userDirectory: state.userDirectory.map(u => {
        if (u.userId.toUpperCase() === cleanId) {
          updated = true
          return { ...u, passwordHash: newPassword }
        }
        return u
      })
    }))

    if (updated) {
      return { success: true, message: `Password for "${cleanId}" reset successfully.` }
    }
    return { success: false, message: `User ID "${cleanId}" not found.` }
  },

  toggleUserStatus: (userId) => {
    const cleanId = userId.trim().toUpperCase()
    set(state => ({
      userDirectory: state.userDirectory.map(u => {
        if (u.userId.toUpperCase() === cleanId) {
          return { ...u, isActive: !u.isActive }
        }
        return u
      })
    }))
  }
}))
