import { apiSlice } from "../api/apiSlice";

export const nodeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createNode: builder.mutation({
            query: (arg) => ({
                url: "/api/resources/nodes/",
                method: "POST",
                body: arg,
            }),
            invalidatesTags: ["Node"],
        }),
        updateNode: builder.mutation({
            query: (arg) => ({
                url: `/api/resources/nodes/${arg.id}/`,
                method: "PATCH",
                body: arg.body,
            }),
            invalidatesTags: ["Node"],
        }),
        deleteNode: builder.mutation({
            query: (id) => ({
                url: `/api/resources/nodes/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Node"],
        }),
    }),
});

export const {
    useCreateNodeMutation,
    useUpdateNodeMutation,
    useDeleteNodeMutation,
} = nodeApiSlice;
