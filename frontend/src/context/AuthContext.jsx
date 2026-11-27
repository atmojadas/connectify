
import { createContext, useContext, useState, useEffect } from 'react'

// Create a shared authentication context
const AuthContext = createContext()

// Provider makes authentication data available to the app
export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem('token')
    )

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    // Automatically log out when the JWT expires
    useEffect(() => {

        if (!token) {
            return
        }

        try {
            // Decode the JWT payload
            const payload = JSON.parse(
                atob(
                    token.split('.')[1]
                        .replace(/-/g, '+')
                        .replace(/_/g, '/')
                )
            )

            // Get token expiration time
            const expirationTime = payload.exp * 1000

            // Calculate remaining time
            const remainingTime = expirationTime - Date.now()

            // If token has already expired, log out
            if (remainingTime <= 0) {
                logout()
                return
            }

            // Automatically log out when token expires
            const timer = setTimeout(() => {
                logout()
            }, remainingTime)

            // Clean up timer
            return () => clearTimeout(timer)

        } catch (error) {
            console.error('Invalid JWT token:', error)
            logout()
        }

    }, [token])

    // Save login information
    function login(accessToken, userData) {
        localStorage.setItem('token', accessToken)
        localStorage.setItem('user', JSON.stringify(userData))

        setToken(accessToken)
        setUser(userData)
    }

    // Clear login information
    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setToken(null)
        setUser(null)
    }

    // Reusable API request function
    async function apiFetch(url, options = {}) {

        const currentToken = localStorage.getItem('token')

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...(currentToken && {
                    Authorization: `Bearer ${currentToken}`
                })
            }
        })

        // Handle expired or invalid JWT
        if (response.status === 401) {
            logout()
        }

        return response
    }

    return (
        <AuthContext.Provider
            value={{ token, user, login, logout, apiFetch }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook for accessing authentication
export function useAuth() {
    return useContext(AuthContext)
}
