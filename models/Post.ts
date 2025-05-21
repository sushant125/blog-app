import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this post.'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema); 