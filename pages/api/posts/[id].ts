import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import Post from '../../../models/Post';

type ErrorResponse = {
  error: string;
  details?: string;
};

type SuccessResponse = {
  message?: string;
  [key: string]: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  try {
    await connectDB();
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    switch (req.method) {
      case 'GET':
        try {
          const post = await Post.findById(id);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          res.status(200).json(post);
        } catch (error) {
          console.error('Error fetching post:', error);
          res.status(500).json({ 
            error: 'Error fetching post',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      case 'PUT':
        try {
          const { title, content, author } = req.body;

          // Validate required fields
          if (!title || !content || !author) {
            return res.status(400).json({
              error: 'Missing required fields',
              details: 'Title, content, and author are required'
            });
          }

          const post = await Post.findByIdAndUpdate(
            id,
            { 
              title,
              content,
              author,
              updatedAt: new Date()
            },
            { new: true, runValidators: true }
          );

          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          res.status(200).json(post);
        } catch (error) {
          console.error('Error updating post:', error);
          res.status(400).json({ 
            error: 'Error updating post',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      case 'DELETE':
        try {
          const post = await Post.findByIdAndDelete(id);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
          console.error('Error deleting post:', error);
          res.status(400).json({ 
            error: 'Error deleting post',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
        break;
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 