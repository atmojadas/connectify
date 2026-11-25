
import { useState } from 'react'

function Register() {

    // Store form input values
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Store API response messages
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Handle registration form submission
    async function handleRegister(event) {

        event.preventDefault()

        setMessage('')
        setLoading(true)

        try {

            const response = await fetch(
                'http://127.0.0.1:5000/api/users',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            setMessage('Account created successfully!')

            setUsername('')
            setEmail('')
            setPassword('')

        } catch (error) {

            setMessage(error.message)

        } finally {

            setLoading(false)

        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Create Account</h1>

                <p className="auth-description">
                    Join Connectify and start connecting.
                </p>

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="signup-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                </form>

                {message && (
                    <p className="auth-switch">
                        {message}
                    </p>
                )}

                <p className="auth-switch">
                    Already have an account?
                    <a href="/login"> Login</a>
                </p>

            </div>

        </div>
    )
}

export default Register
