import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import { validateEmail, validatePassword, validatePhone, validateURL, validateUUID, validatePrice, validateRating, validateTextLength } from './security';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Auth validation
export const validateRegister = [
  validateTextLength('name', 2, 100),
  validateEmail(),
  validatePassword(),
  validatePhone(),
  validateTextLength('address', 0, 500),
  validateTextLength('city', 0, 100),
  validateTextLength('country', 0, 100),
  handleValidationErrors
];

export const validateLogin = [
  validateEmail(),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
];

// Product validation
export const validateCreateProduct = [
  validateTextLength('name', 2, 200),
  validateTextLength('description', 0, 1000),
  validatePrice(),
  validateURL(),
  // Accept cuid/string IDs (not strictly UUID)
  body('categoryId')
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('Valid category ID required'),
  body('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
  validateRating(),
  handleValidationErrors
];

export const validateUpdateProduct = [
  body('name').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Product name must be 2-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('price').optional().isFloat({ min: 0, max: 999999.99 }).withMessage('Price must be a positive number'),
  body('image').optional().custom((value) => {
    if (typeof value !== 'string') return false;
    if (value.startsWith('http://') || value.startsWith('https://')) return true;
    if (value.startsWith('/uploads/')) return true;
    return false;
  }).withMessage('Valid image URL required (http(s) or /uploads/...)'),
  // Accept cuid/string IDs (not strictly UUID)
  body('categoryId').optional().isString().isLength({ min: 3, max: 100 }).withMessage('Valid category ID required'),
  body('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be 0-5'),
  handleValidationErrors
];

// Category validation
export const validateCreateCategory = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Category name must be 2-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  handleValidationErrors
];

// Cart validation
export const validateAddToCart = [
  validateUUID('productId'),
  body('quantity').isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100'),
  handleValidationErrors
];

// Order validation
export const validateCreateOrder = [
  body('shippingAddress').trim().isLength({ min: 10, max: 500 }).withMessage('Shipping address must be 10-500 characters'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes too long'),
  handleValidationErrors
];

// Testimonial validation
export const validateCreateTestimonial = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('location').trim().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
  body('text').trim().isLength({ min: 10, max: 1000 }).withMessage('Testimonial must be 10-1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  handleValidationErrors
];

// Params validation
export const validateId = [
  // Accept cuid/string IDs used by Prisma
  param('id').isString().isLength({ min: 3, max: 100 }).withMessage('Valid ID required'),
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'rating']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];
