import { apiSlice } from "../api/apiSlice";

export const workspaceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWorkspaces: builder.query({
            query: () => ({
                url: "/api/resources/workspaces/",
            }),
            providesTags: ["Workspaces"],
        }),
        fetchWorkspaceById: builder.query({
            query: (id) => `/api/resources/workspaces/${id}/`,
            providesTags: (result, error, id) => [{ type: "Workspace", id }],
        }),
        createWorkspace: builder.mutation({
            query: () => ({
                url: "/api/resources/workspaces/",
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["Workspace"],
        }),
        updateWorkspace: builder.mutation({
            query: (arg) => ({
                url: `/api/resources/workspaces/${arg.id}/`,
                method: "PATCH",
                body: arg.body,
            }),
            invalidatesTags: ["Workspace"],
        }),
        deleteWorkspace: builder.mutation({
            query: (id) => ({
                url: `/api/resources/workspace/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Workspace"],
        }),
    }),
});

export const {
    useGetWorkspacesQuery,
    useFetchWorkspaceByIdQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation,
} = workspaceApiSlice;
