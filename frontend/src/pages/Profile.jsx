
import { useAuth } from '../context/AuthContext'

function Profile() {

    const { user } = useAuth()

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1>My Profile</h1>

                {user ? (
                    <>
                        <div className="form-group">
                            <label>User ID</label>
                            <p>{user.id}</p>
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <p>{user.username}</p>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <p>{user.email}</p>
                        </div>
                    </>
                ) : (
                    <p>Please log in to view your profile.</p>
                )}

            </div>
        </div>
    )
}

export default Profile
