
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function PostCard({ post, onPostUpdated, onPostDeleted }) {

    const { token, user } = useAuth()

    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(post.content)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Check whether this post belongs to the logged-in user
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
            const response = await fetch(
                `http://127.0.0.1:5000/api/posts/${post.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
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
            const response = await fetch(
                `http://127.0.0.1:5000/api/posts/${post.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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
                            value={editedContent}
                            onChange={(event) =>
                                setEditedContent(event.target.value)
                            }
                            rows="4"
                        />

                        <button
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
