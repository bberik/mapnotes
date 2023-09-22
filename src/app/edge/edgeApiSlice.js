import { apiSlice } from "../api/apiSlice";

export const edgeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createEdge: builder.mutation({
            query: (arg) => ({
                url: "/api/resources/edges/",
                method: "POST",
                body: arg,
            }),
            invalidatesTags: ["Edge"],
        }),
        deleteEdge: builder.mutation({
            query: (id) => ({
                url: `/api/resources/edges/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Edge"],
        }),
    }),
});

export const {
    useCreateEdgeMutation,
    useDeleteEdgeMutation,
} = edgeApiSlice;
