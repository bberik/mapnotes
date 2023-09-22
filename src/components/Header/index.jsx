import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
    Button,
    Chip,
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './index.css'
import { useNavigate } from "react-router-dom";
import { useCreateWorkspaceMutation, useGetWorkspacesQuery, useUpdateWorkspaceMutation } from "../../app/workspace/workspaceApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/auth/authSlice";
import { useDispatch } from "react-redux";
import { setWorkspace } from "../../app/workspace/workspaceSlice";

function Navbar({ workspace }) {
    const [workspaceTitle, setWorkspaceTitle] = useState('')
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser);
    const [workspaces, setWorkspaces] = useState([])
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [createWorkspace, { data: created_workspace }] =
        useCreateWorkspaceMutation();

    const { data, isLoading, isSuccess, isError, error } =
        useGetWorkspacesQuery();


    useEffect(() => {
        if (!isError && data) {
            const workspaceList = data.map((workspace, index) => ({
                key: workspace.title || `Untitled ${index}`,
                value: workspace.id,
            }));
            setWorkspaces(workspaceList)
        }
    }, [data, isError])

    const [updateWorkspace, updated_workspace] = useUpdateWorkspaceMutation()

    const handleWorkspaceTitleChange = (event) => {
        setWorkspaceTitle(event.target.value)
    }

    const handleWorkspaceTitleSync = () => {
        updateWorkspace({ id: workspace.id, body: { title: workspaceTitle } })
    }

    useEffect(() => {
        if (workspace && workspace.title)
            setWorkspaceTitle(workspace.title)
    }, [workspace])



    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        dispatch(setWorkspace({ workspace: option }))
        setIsOpen(false);
        window.location.reload()
    };



    const handleCreateWorkspace = () => {
        createWorkspace().then(response => {
            dispatch(setWorkspace({ workspace: response.data.id }))
            window.location.reload();
        });
    }


    return (
        <AppBar position="absolute" className="header">
            <CssBaseline />
            <Toolbar className="header-toolbar-left">
                <Button variant="filled" className="header-button" startIcon={<ArrowBackIosIcon />} onClick={() => navigate('/')}></Button>
                <input className="header-input" placeholder="Workspace Title" value={workspaceTitle} onChange={handleWorkspaceTitleChange} onBlur={handleWorkspaceTitleSync}></input>
            </Toolbar>
            {user && <Toolbar className="header-toolbar-right">
                <button onClick={handleCreateWorkspace}>Create New Workspace</button>
                <div className="dropdown-container">
                    <button className="dropdown-toggle" onClick={toggleDropdown}>
                        My Workspaces
                    </button>
                    {isOpen && (
                        <div className="dropdown-menu">
                            {workspaces.map((ws, index) =>
                                (<button key={ws.key} onClick={() => handleSelect(ws.value)}>{ws.key}</button>)
                            )}
                        </div>
                    )}
                </div>
                <button>Logout</button>
            </Toolbar>}
        </AppBar>
    );
}
export default Navbar;

