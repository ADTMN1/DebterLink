import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.config.js';
import { ProfileModel } from '../models/profile.model.js';
import { body, validationResult } from 'express-validator';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  console.log('File filter checking:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    fieldname: file.fieldname
  });
  
  // Accept all image mimetypes and also check file extension
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    console.log('File accepted');
    cb(null, true);
  } else {
    console.log('File rejected - mimetype:', file.mimetype, 'extension:', fileExtension);
    cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload/Update profile image
export const uploadProfileImage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const userId = req.user.user_id;
    
    // Get existing profile to delete old image if exists
    const existingProfile = await ProfileModel.getByUserId(userId);
    
    // Upload new image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, userId);
    
    // Update profile in database
    const updatedProfile = await ProfileModel.updateProfileImage(
      userId,
      cloudinaryResult.url,
      cloudinaryResult.public_id
    );

    // Delete old image from Cloudinary if it existed
    if (existingProfile && existingProfile.profile_image_public_id) {
      try {
        // Construct the full public_id for deletion
        const oldPublicId = `DebterLink/users/${userId}/profile`;
        await deleteFromCloudinary(oldPublicId);
      } catch (error) {
        console.error('Error deleting old profile image:', error);
        // Continue even if deletion fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profile_image_url: updatedProfile.profile_image_url,
        public_id: updatedProfile.profile_image_public_id,
        size: cloudinaryResult.size,
        format: cloudinaryResult.format
      }
    });

  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update profile information
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const userId = req.user.user_id;
    const profileData = req.body;

    // Handle social_links and preferences if they come as strings
    if (profileData.social_links && typeof profileData.social_links === 'string') {
      try {
        profileData.social_links = JSON.parse(profileData.social_links);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for social_links'
        });
      }
    }

    if (profileData.preferences && typeof profileData.preferences === 'string') {
      try {
        profileData.preferences = JSON.parse(profileData.preferences);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for preferences'
        });
      }
    }

    const updatedProfile = await ProfileModel.upsert(userId, profileData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const profile = await ProfileModel.getByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });

  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete profile image
export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Get existing profile to get the public_id
    const existingProfile = await ProfileModel.getByUserId(userId);
    
    if (!existingProfile || !existingProfile.profile_image_public_id) {
      return res.status(404).json({
        success: false,
        message: 'No profile image found'
      });
    }

    // Delete from Cloudinary using the correct public_id format
    const publicId = `DebterLink/users/${userId}/profile`;
    await deleteFromCloudinary(publicId);
    
    // Update database
    await ProfileModel.deleteProfileImage(userId);

    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Validation rules
export const validateProfileUpdate = [
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('date_of_birth').optional().isISO8601().withMessage('Invalid date format'),
  body('address').optional().isLength({ max: 500 }).withMessage('Address must be less than 500 characters'),
  body('emergency_contact_name').optional().isLength({ max: 120 }).withMessage('Emergency contact name must be less than 120 characters'),
  body('emergency_contact_phone').optional().isLength({ max: 20 }).withMessage('Emergency contact phone must be less than 20 characters'),
  body('social_links').optional().custom((value) => {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        throw new Error('Invalid JSON format for social_links');
      }
    }
    return true;
  }),
  body('preferences').optional().custom((value) => {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        throw new Error('Invalid JSON format for preferences');
      }
    }
    return true;
  })
];
