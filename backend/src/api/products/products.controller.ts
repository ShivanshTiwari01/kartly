import { Request, Response } from 'express';
import Product from '../../models/product.model';
import ProductDetails from '../../models/productDetails.model';
import { logger } from '../../app';
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from './products.validation';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const parsed = getProductsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const {
      page: pageNum,
      limit: limitNum,
      category,
      minPrice,
      maxPrice,
      search,
    } = parsed.data;
    const skip = (pageNum - 1) * limitNum;

    const productFilter: Record<string, any> = {};
    if (category) productFilter.categoryId = category;
    if (search) productFilter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(productFilter)
      .skip(skip)
      .limit(limitNum)
      .populate('categoryId', 'name description')
      .lean();

    const productIds = products.map((p) => p._id);
    const detailsFilter: Record<string, any> = {
      productId: { $in: productIds },
    };
    if (minPrice !== undefined)
      detailsFilter.price = { ...detailsFilter.price, $gte: minPrice };
    if (maxPrice !== undefined)
      detailsFilter.price = { ...detailsFilter.price, $lte: maxPrice };

    const allDetails = await ProductDetails.find(detailsFilter).lean();
    const detailsMap = new Map(allDetails.map((d) => [String(d.productId), d]));

    const result = products
      .map((p) => {
        const details = detailsMap.get(String(p._id));
        if ((minPrice !== undefined || maxPrice !== undefined) && !details)
          return null;
        return { ...p, details: details ?? null };
      })
      .filter(Boolean);

    const total = await Product.countDocuments(productFilter);

    return res.status(200).json({
      success: true,
      data: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('categoryId', 'name description')
      .lean();
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    const details = await ProductDetails.findOne({ productId: id }).lean();
    return res
      .status(200)
      .json({ success: true, data: { ...product, details: details ?? null } });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const {
      name,
      description,
      summary,
      categoryId,
      price,
      discountedPrice,
      stock,
      images,
      tags,
      specs,
    } = parsed.data;

    const product = await Product.create({
      name,
      description,
      summary,
      categoryId,
    });
    const details = await ProductDetails.create({
      productId: product._id,
      price,
      discountedPrice: discountedPrice ?? undefined,
      stock: stock ?? 0,
      images: images ?? [],
      tags: tags ?? [],
      specs: specs ?? {},
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { ...product.toObject(), details: details.toObject() },
    });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const {
      name,
      description,
      summary,
      categoryId,
      price,
      discountedPrice,
      stock,
      images,
      tags,
      specs,
    } = parsed.data;

    const productUpdate: Record<string, any> = {};
    if (name !== undefined) productUpdate.name = name;
    if (description !== undefined) productUpdate.description = description;
    if (summary !== undefined) productUpdate.summary = summary;
    if (categoryId !== undefined) productUpdate.categoryId = categoryId;

    const product = await Product.findByIdAndUpdate(id, productUpdate, {
      new: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    const detailsUpdate: Record<string, any> = {};
    if (price !== undefined) detailsUpdate.price = price;
    if (discountedPrice !== undefined)
      detailsUpdate.discountedPrice = discountedPrice;
    if (stock !== undefined) detailsUpdate.stock = stock;
    if (images !== undefined) detailsUpdate.images = images;
    if (tags !== undefined) detailsUpdate.tags = tags;
    if (specs !== undefined) detailsUpdate.specs = specs;

    const details = await ProductDetails.findOneAndUpdate(
      { productId: id },
      detailsUpdate,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { ...product.toObject(), details: details?.toObject() ?? null },
    });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    await ProductDetails.findOneAndDelete({ productId: id });
    return res
      .status(200)
      .json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
