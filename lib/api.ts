import { toast } from "@/hooks/use-toast"

const API_URL = "http://localhost:8080"

// Helper to get the auth token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Generic fetch function with error handling
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem("auth_token")
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("Session expired. Please login again.")
    }

    // For non-204 responses, parse the JSON
    if (response.status !== 204) {
      const data = await response.json()

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(data.message || "An error occurred")
      }

      return data
    }

    return null
  } catch (error: any) {
    // Improve error handling for network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error: Could not connect to the API server. Please check if the backend is running.")
      throw new Error("Could not connect to the server. Please check your connection or try again later.")
    }

    console.error("API Error:", error)
    throw error
  }
}

// API methods
export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),

  post: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
}

// Response handler for mutations with toast notifications
export const handleApiResponse = async (
  promise: Promise<any>,
  { successMessage = "Operation successful", errorMessage = "Operation failed" } = {},
) => {
  try {
    const result = await promise
    toast({
      title: "Success",
      description: successMessage,
    })
    return result
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || errorMessage,
      variant: "destructive",
    })
    throw error
  }
}
