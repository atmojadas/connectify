
function Login() {

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-description">
                    Login to continue to Connectify.
                </p>

                <form>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="signup-btn">
                        Login
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?
                    <a href="/register"> Register</a>
                </p>

            </div>

        </div>
    )
}

export default Login
