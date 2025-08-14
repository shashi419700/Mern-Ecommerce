import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
// ✅ DB Connection
export const connectDB = (uri) => {
    mongoose
        .connect(uri, {
        dbName: "Ecommerce_25",
    })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
// ✅ Cache Invalidation
export const invalidateCache = async ({ product, admin, order, userId, orderId, productId, }) => {
    // Product cache clear
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (Array.isArray(productId)) {
            productId.forEach((i) => productKeys.push(`product-${i}`));
        }
        myCache.del(productKeys); // ✅ Missing line fixed
    }
    // Order cache clear
    if (order) {
        const orderKeys = [];
        if (userId)
            orderKeys.push(`orders-${userId}`);
        if (orderId)
            orderKeys.push(`order-${orderId}`);
        myCache.del(orderKeys);
    }
    // Admin cache clear
    if (admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
    }
};
// ✅ Reduce product stock
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
// ✅ Calculate percentage change
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
// ✅ Inventory data
export const getInventories = async ({ categories, productCount, }) => {
    const categoriesCount = await Promise.all(categories.map((category) => Product.countDocuments({ categories: category })));
    return categories.map((category, i) => ({
        [category]: (categoriesCount[i] / productCount) * 100,
    }));
};
export const getCharData = ({ length, docArr, today, property }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property] ?? 0;
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};
