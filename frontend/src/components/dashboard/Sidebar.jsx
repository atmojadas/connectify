
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar() {

    const { user } = useAuth()

    return (
        <aside className="dashboard-sidebar">

            <div className="sidebar-profile">
                <div className="profile-avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>

                <h3>{user?.username || 'Connectify User'}</h3>
                <p>Welcome to your community</p>
            </div>

            <div className="sidebar-menu">

                <p className="sidebar-heading">MENU</p>

                <NavLink to="/" end className="sidebar-link">
                    <span>⌂</span>
                    Home
                </NavLink>

                <NavLink to="/explore" className="sidebar-link">
                    <span>⌕</span>
                    Explore
                </NavLink>

                <NavLink to="/notifications" className="sidebar-link">
                    <span>♧</span>
                    Notifications
                </NavLink>

                <NavLink to="/messages" className="sidebar-link">
                    <span>✉</span>
                    Messages
                </NavLink>

                <NavLink to="/profile" className="sidebar-link">
                    <span>♙</span>
                    My Profile
                </NavLink>

            </div>

            <div className="sidebar-footer">
                <p>CONNECTIFY</p>
                <span>Connect. Share. Belong.</span>
            </div>

        </aside>
    )
}

export default Sidebar
