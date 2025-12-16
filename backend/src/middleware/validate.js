import { body, validationResult } from "express-validator";

const rejectHtml = (value) => {
  if (typeof value !== "string") return true;
  if (/<[^>]*>/.test(value)) {
    throw new Error("HTML is not allowed");
  }
  return true;
};

// In validate.js - Update the validation rules to match your nested structure
const nestedSchoolValidation = [
  body('school')
    .exists().withMessage('School information is required')
    .bail()
    .isObject()
    .withMessage('School must be an object'),
  
  body('school.name')
    .trim()
    .notEmpty()
    .withMessage('School name is required')
    .custom(rejectHtml)
    .isLength({ min: 2, max: 100 })
    .withMessage('School name must be between 2 and 100 characters'),
  
  body('school.code')
    .trim()
    .notEmpty()
    .withMessage('School code is required'),
  
  body('school.email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid school email')
    .normalizeEmail(),
  
  body('school.phone')
    .trim()
    .notEmpty()
    .withMessage('School phone number is required'),
  
  body('school.address')
    .trim()
    .notEmpty()
    .withMessage('School address is required'),
    
  body('school.address')
    .custom(rejectHtml),
  
  body('school.academic_year')
    .trim()
    .notEmpty()
    .withMessage('Academic year is required'),
  
  body('school.status')
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Invalid school status')
];

const adminValidation = [
  body('admin')
    .exists().withMessage('Admin information is required')
    .bail()
    .isObject()
    .withMessage('Admin must be an object'),
  
  body('admin.first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .custom(rejectHtml)
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('admin.last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .custom(rejectHtml)
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('admin.email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('admin.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  
  body('admin.password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain at least one special character (@$!%*?&)'),
  
  body('admin.confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.admin?.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  body('admin.role_id')
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer')
];

// Update the registerValidation to use the new structure
export const registerValidation = [
  ...nestedSchoolValidation,
  ...adminValidation
];

// Remove creatorValidation from registerValidation since weim get this from the token
// The creator info should come from the authenticated user's token

// Login validation
export const loginValidationRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};