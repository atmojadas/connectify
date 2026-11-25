
function Navbar() {

    return (

        <nav className="navbar">

            <div className="logo">
                Connectify<span>.</span>
            </div>

            <div className="nav-links">

                <a href="#home">Home</a>

                <a href="#features">Features</a>

                <a href="#about">About</a>

            </div>

            <div className="nav-buttons">

                <button className="login-btn">
                    Login
                </button>

                <button className="signup-btn">
                    Get Started
                </button>

            </div>

        </nav>

    )
}

export default Navbar

