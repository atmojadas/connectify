
function RightSidebar() {

    const trendingTopics = [
        { tag: '#Technology', posts: '2.4k posts' },
        { tag: '#CloudComputing', posts: '1.8k posts' },
        { tag: '#Photography', posts: '950 posts' },
        { tag: '#Community', posts: '720 posts' }
    ]

    return (
        <aside className="right-sidebar">

            <div className="right-sidebar-card">

                <h3>Trending Topics</h3>

                <div className="trending-list">
                    {trendingTopics.map((topic) => (
                        <div className="trending-item" key={topic.tag}>
                            <div>
                                <h4>{topic.tag}</h4>
                                <span>{topic.posts}</span>
                            </div>

                            <span className="trending-arrow">↗</span>
                        </div>
                    ))}
                </div>

                <button className="see-more-btn">
                    Explore topics
                </button>

            </div>

            <div className="right-sidebar-card community-card">

                <h3>Build Your Community</h3>

                <p>
                    Connect with people, share your ideas,
                    and discover new perspectives.
                </p>

                <div className="community-decoration">
                    <span>✦</span>
                    <span>◈</span>
                    <span>✧</span>
                </div>

            </div>

            <div className="right-sidebar-footer">
                <span>About</span>
                <span>Privacy</span>
                <span>Terms</span>
                <p>© 2026 Connectify</p>
            </div>

        </aside>
    )
}

export default RightSidebar
