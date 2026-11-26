import { useLocation } from 'react-router-dom'

function Profile() {

    const location = useLocation()

    // Receive profile information from the previous page
    const profileData = location.state?.profile

    const user = profileData?.user || profileData

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