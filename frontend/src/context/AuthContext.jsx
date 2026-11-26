
import { createContext, useContext, useState } from 'react'

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

    return (
        <AuthContext.Provider
            value={{ token, user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook for accessing authentication
export function useAuth() {
    return useContext(AuthContext)
}
