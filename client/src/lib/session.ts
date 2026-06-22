import type { AuthResponse, MeResponse, SessionUser } from "@/lib/types"

const storageKey = "acme-session"

export type StoredSession = {
  accessToken: string
  refreshToken: string
  user: SessionUser
}

export function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(storageKey)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredSession
  } catch {
    return null
  }
}

export function writeStoredSession(payload: AuthResponse | StoredSession) {
  if (typeof window === "undefined") return

  const session: StoredSession = {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    user: payload.user,
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session))
}

export function clearStoredSession() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(storageKey)
}

export function updateStoredUser(user: MeResponse) {
  const session = readStoredSession()
  if (!session) return
  writeStoredSession({ ...session, user })
}
