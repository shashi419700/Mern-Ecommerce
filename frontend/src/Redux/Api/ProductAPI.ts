import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AllProductsResponce,
  CategoriesResponce,
  deleteProductsRequest,
  MessageResponse,
  NewProductsRequest,
  ProductsResponce,
  SearchProductsRequest,
  SearchProductsResponce,
  UpdateProductsRequest,
} from "../../Types/API-Types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/app/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponce, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    allProducts: builder.query<AllProductsResponce, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<CategoriesResponce, string>({
      query: () => `categories`,
      providesTags: ["product"],
    }),
    searchProducts: builder.query<
      SearchProductsResponce,
      SearchProductsRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["product"],
    }),

    productDetails: builder.query<ProductsResponce, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    newProduct: builder.mutation<MessageResponse, NewProductsRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation<MessageResponse, UpdateProductsRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    delteProduct: builder.mutation<MessageResponse, deleteProductsRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

// Hooks
export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDelteProductMutation,
} = productAPI;
