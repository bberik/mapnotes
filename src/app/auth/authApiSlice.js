import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login/',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/token/refresh/',
                method: 'POST',
            })
        }),
        signup: builder.mutation({
            query: credentials => ({
                url: '/auth/registration/',
                method: 'POST',
                body: { ...credentials }
            })
        }),
    })
})

export const {
    useLoginMutation,
    useRefreshMutation,
    useSignupMutation,
} = authApiSlice