import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  uploadProfileImage,
  updateProfile,
  getProfile,
  deleteProfileImage,
  upload,
  validateProfileUpdate
} from '../controllers/profile.controller.js';

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

// Upload/Update profile image
router.post('/image', upload.single('profile_image'), uploadProfileImage);

// Delete profile image
router.delete('/image', deleteProfileImage);

// Get profile
router.get('/', getProfile);

// Update profile information
router.put('/', validateProfileUpdate, updateProfile);

export default router;
