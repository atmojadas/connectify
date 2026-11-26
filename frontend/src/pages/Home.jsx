
import { useEffect, useState } from 'react'

import Sidebar from '../components/dashboard/Sidebar'
import PostComposer from '../components/dashboard/PostComposer'
import PostCard from '../components/dashboard/PostCard'
import RightSidebar from '../components/dashboard/RightSidebar'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/posts')
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to load posts')
            }

            setPosts(data.posts)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-feed">
                <div className="feed-heading">
                    <div>
                        <h1>Your Feed</h1>
                        <p>Discover what's happening in your community.</p>
                    </div>
                </div>

                <PostComposer
    onPostCreated={(newPost) => {
        setPosts((previousPosts) => [newPost, ...previousPosts])
    }}
/>

                <div className="feed-posts">
                    {loading && <p>Loading posts...</p>}

                    {error && <p>{error}</p>}

                    {!loading && !error && posts.length === 0 && (
                        <p>No posts yet. Be the first to share something!</p>
                    )}

                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}

export default Home
