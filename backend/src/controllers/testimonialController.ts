import { Request, Response } from 'express';
import { prisma } from '../index';
import { CreateTestimonialRequest } from '../types';

export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query as any;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.testimonial.count()
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        testimonials,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, location, text, rating }: CreateTestimonialRequest = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location,
        text,
        rating
      }
    });

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, text, rating } = req.body;

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existingTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        location,
        text,
        rating
      }
    });

    res.json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
