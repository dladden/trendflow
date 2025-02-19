import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
} from '../controllers/blogController.js';
import {
  authenticateUser,
  authorizedPermissions,
  authorizedAdmin,
} from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/create-post',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('write'),
  createPost
); // Create a new blog post (admin only)
router.get('/', getAllPosts); // Get all blog posts
router.get('/:slug', getSinglePost); // Get a single blog post by slug
router.patch(
  '/edit/:slug',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('delete'),
  updatePost
); // Update a blog post by slug (admin only)
router.delete(
  '/delete/:slug',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('delete'),
  deletePost
); // Delete a blog post by slug (admin only)

export default router;
