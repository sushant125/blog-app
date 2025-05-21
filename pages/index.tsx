import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">
            My Blog
          </Link>
          <Link href="/posts/create" className="btn btn-light">
            Create New Post
          </Link>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          {posts.map((post) => (
            <div key={post._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <Link href={`/posts/${post._id}`} className="text-decoration-none">
                    <h2 className="card-title h4 text-primary mb-3">{post.title}</h2>
                  </Link>
                  <p className="card-text text-muted small mb-3">
                    By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    {post.content.substring(0, 150)}...
                  </p>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <Link 
                    href={`/posts/${post._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 