import { Request, Response } from 'express';
import Categories from '../../models/categories.model';
import Product from '../../models/product.model';
import { logger } from '../../app';
import {
  createCategorySchema,
  updateCategorySchema,
} from './categories.validation';

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Categories.find().lean();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Categories.findById(id).lean();
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }
    const products = await Product.find({ categoryId: id }).lean();
    return res
      .status(200)
      .json({ success: true, data: { ...category, products } });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const category = await Categories.create(parsed.data);
    return res
      .status(201)
      .json({ success: true, message: 'Category created', data: category });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const category = await Categories.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }
    return res
      .status(200)
      .json({ success: true, message: 'Category updated', data: category });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
