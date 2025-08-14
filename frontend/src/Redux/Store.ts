import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./Api/ProductAPI";
import { userAPI } from "./Api/UserAPI";
import { userReducer } from "./Reducer/UserReducer";
import { cartReducer } from "./Reducer/cardReducer";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
  },
  middleware: (mid) => [...mid(), userAPI.middleware, productAPI.middleware],
});
