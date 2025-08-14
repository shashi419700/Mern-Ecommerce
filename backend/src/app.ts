import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";

// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/orders.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

config({
  path: "./.env",
});
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("API working with /api/v1");
});

app.listen(port, () => {
  //using routes
  app.use("/app/v1/user", userRoute);
  app.use("/app/v1/product", productRoute);
  app.use("/app/v1/order", orderRoute);
  app.use("/app/v1/payment", paymentRoute);
  app.use("/app/v1/dashboard", dashboardRoute);

  app.use("/uploads", express.static("uploads"));

  app.use(errorMiddleware);

  console.log(`express is working on http://localhost:${port}`);
});
