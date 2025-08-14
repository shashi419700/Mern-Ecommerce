import { Trycatch } from "../middlewares/error.js";
import { Request } from "express";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/type.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utlity-class.js";
import { rm } from "fs";
import { create } from "domain";
import { userInfo } from "os";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

//Revalidate on New,Update,Delete Product & on New Order
export const getLatestProducts = Trycatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }


  return res.status(201).json({
    success: true,
    products,
  });
});

//Revalidate on New,Update,Delete Product & on New Order
export const getAllCategories = Trycatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(201).json({
    success: true,
    categories,
  });
});

//Revalidate on New,Update,Delete Product & on New Order
export const getAdminProducts = Trycatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
   products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }
  return res.status(201).json({
    success: true,
    products,
  });
});

export const getSingleProduct = Trycatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found ", 404));
    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(201).json({
    success: true,
    product,
  });
});

export const newProduct = Trycatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please Add Photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });
      return next(new ErrorHandler("Please enter All Fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfuly",
    });
  }
);

export const updateProduct = Trycatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("invalid Product Id ", 404));

  if (photo) {
    if (product.photo) {
      rm(product.photo, (err) => {
        if (err) console.error("Error deleting old photo:", err);
        else console.log("Old Photo Deleted");
      });
    }
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfuly",
  });
});

export const deleteProduct = Trycatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("invalid Product Id ", 404));

  if (product.photo) {
    rm(product.photo, (err) => {
      if (err) console.error("Error deleting photo:", err);
      else console.log("Product Photo Deleted");
    });
  }

  await Product.deleteOne();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  invalidateCache({ product: true });

  return res.status(201).json({
    success: true,
    message: "Product Deleted Successfuly",
  });
});

export const getAllProducts = Trycatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };
    if (category) baseQuery.category = category;

    const productPromice = Product.find(baseQuery)
      .sort(sort && { price: sort === "ascending" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productPromice,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(201).json({
      success: true,
      products,
      totalPage,
    });
  }
);
