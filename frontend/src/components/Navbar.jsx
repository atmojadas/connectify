
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {

    const { token, user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                Connectify<span>.</span>
            </Link>

            <div className="nav-links">

                <NavLink to="/" end>
                    Home
                </NavLink>

                <NavLink to="/explore">
                    Explore
                </NavLink>

                {token && (
                    <>
                        <NavLink to="/notifications">
                            Notifications
                        </NavLink>

                        <NavLink to="/messages">
                            Messages
                        </NavLink>

                        <NavLink to="/profile">
                            Profile
                        </NavLink>
                    </>
                )}

            </div>

            <div className="nav-buttons">

                {token ? (
                    <>
                        <span className="nav-username">
                            Hi, {user?.username}
                        </span>

                        <button
                            className="login-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>

                        <button
                            className="signup-btn"
                            onClick={() => navigate('/register')}
                        >
                            Get Started
                        </button>
                    </>
                )}

            </div>

        </nav>
    )
}

export default Navbar
