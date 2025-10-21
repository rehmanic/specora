import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../users/userController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

/**
 * Route structure:
 * GET    /api/users/          -> get all users (admin only)
 * GET    /api/users/:id       -> get single user by ID
 * PUT    /api/users/me        -> update current user's profile
 * DELETE /api/users/:id       -> delete user (admin only)
 */

// Example admin check middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Manager access required' });
  }
  next();
};

router.get('/', requireAdmin, getAllUsers);
router.get('/:id', requireAdmin, getUserById);
router.put('/me', updateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;
