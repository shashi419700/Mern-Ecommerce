import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { MessageResponse } from "../Types/API-Types";
import type { SerializedError } from "@reduxjs/toolkit";
import type { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

type ResType =
  | {
      data: MessageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export const responceToast = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string
) => {
  if ("data" in res) {
    toast.success(res.data.message);
    if (navigate) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;
    const MessageResponse = error.data as MessageResponse;
    toast.error(MessageResponse.message);
  }
};
