import { useEffect, useRef, useState, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { api } from "@/lib/api"
import type { MeResponse } from "@/lib/types"
import { AuthScreen } from "@/components/auth-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { HomeScreen } from "@/components/home-screen"
import { SetupScreen } from "@/components/setup-screen"

function SessionBootstrap({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)
  const status = useAuthStore((state) => state.status)
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const signOut = useAuthStore((state) => state.signOut)
  const loaded = useRef(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (status !== "ready" || loaded.current) return
    loaded.current = true

    if (!accessToken) return

    api
      .get<MeResponse>("/me")
      .then((response) => setUser(response.data))
      .catch(() => signOut())
  }, [accessToken, setUser, signOut, status])

  if (status !== "ready") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}

function RouteTransitionIndicator() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const previousPathRef = useRef(location.pathname)

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return

    previousPathRef.current = location.pathname
    setIsLoading(true)

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null
    }, 650)
  }, [location.pathname])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
      <div className="route-progress-bar h-1 w-full overflow-hidden bg-transparent">
        <div className="route-progress-fill h-full rounded-r-full bg-white/90" />
      </div>
      <Loader2 className="route-spinner absolute right-3 top-3 size-4 text-white/90" />
    </div>
  )
}

function RootRedirect() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return <Navigate to={user.onboardingCompleted ? "/dashboard" : "/dashboard/onboarding?redirectTo=%2Fdashboard"} replace />
}

function PublicRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user)
  if (user) {
    return <Navigate to={user.onboardingCompleted ? "/dashboard" : "/dashboard/onboarding?redirectTo=%2Fdashboard"} replace />
  }
  return <>{children}</>
}

function SetupRoute() {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  if (status !== "ready") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (user?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />
  }

  return <SetupScreen />
}

function HomeRoute() {
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/signin" replace />
  if (!user.onboardingCompleted) return <Navigate to="/dashboard/onboarding?redirectTo=%2Fdashboard" replace />

  return <HomeScreen />
}

function DashboardRoute() {
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/signin" replace />
  if (!user.onboardingCompleted) return <Navigate to="/dashboard/onboarding?redirectTo=%2Fdashboard" replace />

  return <DashboardScreen />
}

function App() {
  return (
    <BrowserRouter>
      <SessionBootstrap>
        <RouteTransitionIndicator />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <AuthScreen mode="signin" />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <AuthScreen mode="signup" />
              </PublicRoute>
            }
          />
          <Route path="/setup" element={<SetupRoute />} />
          <Route path="/dashboard/onboarding" element={<SetupRoute />} />
          <Route path="/home" element={<HomeRoute />} />
          <Route path="/dashboard" element={<HomeRoute />} />
          <Route path="/dashboard/:orgId" element={<DashboardRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionBootstrap>
    </BrowserRouter>
  )
}

export default App
