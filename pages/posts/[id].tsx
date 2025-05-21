import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          <div className="alert alert-warning" role="alert">
            Post not found
          </div>
          <Link href="/" className="btn btn-primary">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">
            My Blog
          </Link>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <Link href="/" className="btn btn-outline-secondary btn-sm mb-4">
                  ← Back to Posts
                </Link>
                <article>
                  <h1 className="h2 mb-3">{post.title}</h1>
                  <div className="text-muted mb-4">
                    By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="post-content">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 