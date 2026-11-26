import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()


    async function handleLogin(event) {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
        const response = await fetch(
            'http://127.0.0.1:5000/api/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        )

        const data = await response.json()

        if (!response.ok) {
    throw new Error(data.message || 'Login failed')
}

// Fetch the logged-in user's profile
const profileData = await fetchProfile(data.access_token)

// Save authentication information globally
login(
    data.access_token,
    profileData.user || profileData
)

// Navigate to the profile page
navigate('/profile')

setMessage('Login successful! Profile loaded.')

    } catch (error) {
        setMessage(error.message)

    } finally {
        setLoading(false)
    }
}

async function fetchProfile(authToken) {

    const response = await fetch(
        'http://127.0.0.1:5000/api/profile',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Could not fetch profile')
    }

    return data
}

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-description">
                    Login to continue to Connectify.
                </p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                             type="email"
                             placeholder="Enter your email"
                             value={email}
                             onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                             type="password"
                             placeholder="Enter your password"
                             value={password}
                             onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <button
                      type="submit"
                      className="signup-btn"
                      disabled={loading}
                    >
    {loading ? 'Logging in...' : 'Login'}
</button>

                </form>
                {message && <p className="auth-switch">{message}</p>}

                <p className="auth-switch">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

            </div>

        </div>
    )
}

export default Login
