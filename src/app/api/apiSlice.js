import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "../auth/authSlice";
import axios from "axios";

// export const baseUrl = "http://127.0.0.1:8000"
export const baseUrl = "https://app.myroof.click"
const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // send refresh token to get new access token
    const refreshResult = await axios.post(`${baseUrl}/auth/token/refresh/`, {}, { withCredentials: true });
    if (refreshResult?.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
