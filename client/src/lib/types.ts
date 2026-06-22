export type SessionUser = {
  id: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  emailVerified: boolean
  onboardingCompleted: boolean
  createdAt?: string
  updatedAt?: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: SessionUser
  nextStep: "setup" | "home"
}

export type MeResponse = SessionUser

export type Organization = {
  id: string
  name: string
  memberCount: number
  createdAt: string
  updatedAt: string
}

export type DashboardMetric = {
  label: string
  value: string
  change: string
}

export type DashboardPoint = {
  label: string
  sent: number
  delivered: number
  marketing: number
  transactional: number
}

export type DashboardResponse = {
  organization: Organization
  metrics: DashboardMetric[]
  timeseries: DashboardPoint[]
  performance: {
    openRate: string
    clickRate: string
  }
}


