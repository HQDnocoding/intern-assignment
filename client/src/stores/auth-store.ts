import { create } from "zustand"
import type { MeResponse, SessionUser } from "@/lib/types"
import { clearStoredSession, readStoredSession, updateStoredUser, writeStoredSession } from "@/lib/session"

type AuthStatus = "loading" | "ready"

type AuthState = {
  status: AuthStatus
  user: SessionUser | null
  accessToken: string | null
  refreshToken: string | null
  initialize: () => void
  setSession: (payload: { accessToken: string; refreshToken: string; user: SessionUser }) => void
  setUser: (user: MeResponse) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  user: null,
  accessToken: null,
  refreshToken: null,
  initialize: () => {
    const session = readStoredSession()

    if (!session) {
      set({ status: "ready", user: null, accessToken: null, refreshToken: null })
      return
    }

    set({
      status: "ready",
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    })
  },
  setSession: (payload) => {
    writeStoredSession(payload)
    set({
      user: payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      status: "ready",
    })
  },
  setUser: (user) => {
    updateStoredUser(user)
    set((state) => ({
      ...state,
      user,
    }))
  },
  signOut: () => {
    clearStoredSession()
    set({ status: "ready", user: null, accessToken: null, refreshToken: null })
  },
}))
