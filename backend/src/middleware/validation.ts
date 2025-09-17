import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param, query } from 'express-validator';

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
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('address').optional().trim().isLength({ max: 500 }).withMessage('Address too long'),
  body('city').optional().trim().isLength({ max: 100 }).withMessage('City name too long'),
  body('country').optional().trim().isLength({ max: 100 }).withMessage('Country name too long'),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
];

// Product validation
export const validateCreateProduct = [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Product name must be 2-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('image').isURL().withMessage('Valid image URL required'),
  body('categoryId').isUUID().withMessage('Valid category ID required'),
  body('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be 0-5'),
  handleValidationErrors
];

export const validateUpdateProduct = [
  body('name').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Product name must be 2-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('image').optional().isURL().withMessage('Valid image URL required'),
  body('categoryId').optional().isUUID().withMessage('Valid category ID required'),
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
  body('productId').isUUID().withMessage('Valid product ID required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
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
  param('id').isUUID().withMessage('Valid ID required'),
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
