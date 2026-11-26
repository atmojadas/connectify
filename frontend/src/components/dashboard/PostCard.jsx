
function PostCard({ post }) {

    return (
        <article className="post-card">

            <div className="post-header">

                <div className="post-avatar">
                    {post.username?.charAt(0).toUpperCase() || 'U'}
                </div>

                <div className="post-author">
                    <h3>{post.username}</h3>
                    <span>{post.created_at || 'Just now'}</span>
                </div>

                <button className="post-menu" aria-label="Post options">
                    ⋯
                </button>

            </div>

            <div className="post-content">
                <p>{post.content}</p>
            </div>

            <div className="post-actions">

                <button type="button">
                    ♡ <span>Like</span>
                </button>

                <button type="button">
                    ◯ <span>Comment</span>
                </button>

                <button type="button">
                    ↗ <span>Share</span>
                </button>

            </div>

        </article>
    )
}

export default PostCard
