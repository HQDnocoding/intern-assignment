import axios from "axios"
import { readStoredSession, writeStoredSession } from "@/lib/session"

export const api = axios.create({
  baseURL: "/api",
})

api.interceptors.request.use((config) => {
  const session = readStoredSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const session = readStoredSession()

    if (status === 401 && session?.refreshToken && original && !original._retry) {
      original._retry = true

      const refreshResponse = await axios.post(
        "/api/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${session.refreshToken}`,
          },
        },
      )

      writeStoredSession(refreshResponse.data)

      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${refreshResponse.data.accessToken}`,
      }

      return api.request(original)
    }

    return Promise.reject(error)
  },
)
