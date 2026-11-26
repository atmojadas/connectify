
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function PostComposer({ onPostCreated }) {
    const { user, token } = useAuth()

    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        if (!content.trim()) return

        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://127.0.0.1:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: content.trim()
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to publish post')
            }

            onPostCreated(data.post)
            setContent('')

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="post-composer">
            <div className="composer-header">
                <div className="composer-avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>

                <div>
                    <h3>Create a post</h3>
                    <p>Share something with your community</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="What's happening in your world?"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows="4"
                />

                <div className="composer-footer">
                    <span>{content.length} characters</span>

                    <button type="submit" disabled={!content.trim() || loading}>
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>

                {error && <p className="post-error">{error}</p>}
            </form>
        </div>
    )
}

export default PostComposer
