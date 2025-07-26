import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: 'path' in err ? err.path : 'unknown',
        message: err.msg,
        value: 'value' in err ? err.value : undefined
      }))
    });
  }
  return next();
};

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  handleValidationErrors,
];

export const validateRegister = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .trim(),
  handleValidationErrors,
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('New password must contain at least one uppercase letter and one special character'),
  handleValidationErrors,
];

export const validateCreateUser = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .trim(),
  body('role')
    .isIn(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'])
    .withMessage('Role must be SYSTEM_ADMIN, NORMAL_USER, or STORE_OWNER'),
  handleValidationErrors,
];

export const validateCreateStore = [
  body('name')
    .isLength({ min: 1, max: 255 })
    .withMessage('Store name is required and must not exceed 255 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('address')
    .isLength({ min: 1, max: 400 })
    .withMessage('Address is required and must not exceed 400 characters')
    .trim(),
  body('ownerId')
    .isUUID()
    .withMessage('Owner ID must be a valid UUID'),
  handleValidationErrors,
];

export const validateCreateRating = [
  body('storeId')
    .isUUID()
    .withMessage('Store ID must be a valid UUID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  handleValidationErrors,
];

export const validateUpdateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  handleValidationErrors,
];

export const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('ID must be a valid UUID'),
  handleValidationErrors,
];

export const validateSearchQuery = [
  query('search')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Search query must not exceed 255 characters')
    .trim(),
  query('role')
    .optional()
    .isIn(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'])
    .withMessage('Role must be SYSTEM_ADMIN, NORMAL_USER, or STORE_OWNER'),
  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'createdAt'])
    .withMessage('Sort field must be name, email, or createdAt'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors,
];