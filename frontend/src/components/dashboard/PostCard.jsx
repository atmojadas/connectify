
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function PostCard({ post, onPostUpdated, onPostDeleted }) {

    const { token, user, apiFetch } = useAuth()

    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(post.content)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // COMMENTS STATE
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)
    const [commentsLoaded, setCommentsLoaded] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentSubmitting, setCommentSubmitting] = useState(false)
    const [commentsError, setCommentsError] = useState('')

    // FETCH COMMENTS
    async function handleToggleComments() {

        const nextState = !showComments
        setShowComments(nextState)

        if (nextState && !commentsLoaded) {

            setCommentsLoading(true)
            setCommentsError('')

            try {
                const response = await apiFetch(
                    `http://127.0.0.1:5000/api/posts/${post.id}/comments`
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load comments')
                }

                setComments(data.comments)
                setCommentsLoaded(true)

            } catch (error) {
                setCommentsError(error.message)
            } finally {
                setCommentsLoading(false)
            }
        }
    }

    // ADD COMMENT
    async function handleAddComment(event) {

        event.preventDefault()

        if (!commentContent.trim()) {
            setCommentsError('Comment cannot be empty')
            return
        }

        if (!token) {
            setCommentsError('Please log in to comment')
            return
        }

        setCommentSubmitting(true)
        setCommentsError('')

        try {
            const response = await apiFetch(
                `http://127.0.0.1:5000/api/posts/${post.id}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: commentContent
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to add comment')
            }

            setComments((previousComments) => [
                ...previousComments,
                data.comment
            ])

            setCommentContent('')

        } catch (error) {
            setCommentsError(error.message)
        } finally {
            setCommentSubmitting(false)
        }
    }

    // CHECK POST OWNERSHIP
    const isOwner = user && Number(user.id) === Number(post.user_id)

    // UPDATE POST
    async function handleUpdate() {

        if (!editedContent.trim()) {
            setError('Post content cannot be empty')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await apiFetch(
                `http://127.0.0.1:5000/api/posts/${post.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: editedContent
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to update post')
            }

            onPostUpdated(data.post)
            setIsEditing(false)

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // DELETE POST
    async function handleDelete() {

        const confirmed = window.confirm(
            'Are you sure you want to delete this post?'
        )

        if (!confirmed) return

        setLoading(true)
        setError('')

        try {
            const response = await apiFetch(
                `http://127.0.0.1:5000/api/posts/${post.id}`,
                {
                    method: 'DELETE'
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to delete post')
            }

            onPostDeleted(post.id)

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

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

                {isOwner && (
                    <div className="post-owner-actions">

                        <button
                            type="button"
                            onClick={() => {
                                setEditedContent(post.content)
                                setIsEditing(!isEditing)
                                setError('')
                            }}
                            disabled={loading}
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Delete
                        </button>

                    </div>
                )}

            </div>

            <div className="post-content">

                {isEditing ? (
                    <div className="post-edit-form">

                        <textarea
                            className="post-edit-textarea"
                            value={editedContent}
                            onChange={(event) =>
                                setEditedContent(event.target.value)
                            }
                            rows="4"
                            placeholder="Edit your post..."
                        />

                        <button
                            className="post-edit-button"
                            type="button"
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>

                    </div>
                ) : (
                    <p>{post.content}</p>
                )}

            </div>

            {error && (
                <p className="post-error">{error}</p>
            )}

            <div className="post-actions">

                <button
                    type="button"
                    onClick={handleToggleComments}
                >
                    ◯ <span>Comment ({comments.length})</span>
                </button>

                <button type="button">
                    ↗ <span>Share</span>
                </button>

            </div>

            {/* COMMENTS SECTION */}

            {showComments && (
                <div className="comments-section">

                    <h4>Comments</h4>

                    {commentsLoading && (
                        <p>Loading comments...</p>
                    )}

                    {commentsError && (
                        <p className="post-error">
                            {commentsError}
                        </p>
                    )}

                    {!commentsLoading && comments.length === 0 && (
                        <p>No comments yet. Be the first to comment!</p>
                    )}

                    <div className="comments-list">

                        {comments.map((comment) => (
                            <div
                                className="comment-item"
                                key={comment.id}
                            >

                                <strong>{comment.username}</strong>

                                <p>{comment.content}</p>

                                <small>{comment.created_at}</small>

                            </div>
                        ))}

                    </div>

                    <form
                        className="comment-form"
                        onSubmit={handleAddComment}
                    >

                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentContent}
                            onChange={(event) =>
                                setCommentContent(event.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={commentSubmitting}
                        >
                            {commentSubmitting ? 'Posting...' : 'Post'}
                        </button>

                    </form>

                </div>
            )}

        </article>
    )
}

export default PostCard
