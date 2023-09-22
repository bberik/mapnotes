import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
    name: "workspace",
    initialState: {
        workspace: localStorage.getItem("currentWorkspace") || null,
    },
    reducers: {
        setWorkspace: (state, action) => {
            const { workspace } = action.payload;
            state.workspace = workspace;

            localStorage.setItem("currentWorkspace", workspace);
        },
        resetWorkspace: (state, action) => {
            state.workspace = null;
            localStorage.removeItem("currentWorkspace");
        },
    },
});

export const { setWorkspace, resetWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;

export const selectCurrentWorkspace = (state) => state.workspace.workspace;
