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

    switch (req.method) {
      case 'GET':
        try {
          const posts = await Post.find().sort({ createdAt: -1 });
          res.status(200).json(posts);
        } catch (error) {
          console.error('Error fetching posts:', error);
          res.status(500).json({ 
            error: 'Error fetching posts',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      case 'POST':
        try {
          const { title, content, author } = req.body;

          // Validate required fields
          if (!title || !content || !author) {
            return res.status(400).json({
              error: 'Missing required fields',
              details: 'Title, content, and author are required'
            });
          }

          const post = await Post.create({
            title,
            content,
            author,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          res.status(201).json(post);
        } catch (error) {
          console.error('Error creating post:', error);
          res.status(400).json({ 
            error: 'Error creating post',
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