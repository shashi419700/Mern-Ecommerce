import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MessageResponse, UserResponse } from "../../Types/API-Types";
import type { User } from "../../Types/type";
import axios from "axios";

export const userAPI = createApi({
  reducerPath: "userapi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/app/v1/user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const getUser = async (id: string) => {
  const { data }: { data: UserResponse } = await axios.get(
    `${import.meta.env.VITE_SERVER}/app/v1/user/${id}`
  );
  return data;
};

export const { useLoginMutation } = userAPI;
