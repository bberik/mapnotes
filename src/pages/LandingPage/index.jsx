import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logOut, selectCurrentUser } from '../../app/auth/authSlice'
import { useCreateWorkspaceMutation, useGetWorkspacesQuery } from '../../app/workspace/workspaceApiSlice'
import { selectCurrentWorkspace, setWorkspace } from '../../app/workspace/workspaceSlice'
import BackgroundImage from '../../assets/images/bg.jpg'
import Logo from '../../assets/images/logo.png'
import './index.css'
import DemoVideo from '../../assets/images/MapNotes.gif'

const LandingPage = () => {
    const user = useSelector(selectCurrentUser);
    const currentWorkspace = useSelector(selectCurrentWorkspace);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false);
    const [workspaces, setWorkspaces] = useState([])
    const [createWorkspace, { data: created_workspace }] =
        useCreateWorkspaceMutation();

    const handleCreateWorkspace = () => {
        createWorkspace().then(response => {
            dispatch(setWorkspace({ workspace: response.data.id }))
            navigate("/canvas")
        });
    }




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

    const handleLogout = () => {
        dispatch(logOut());
        window.location.reload()
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        dispatch(setWorkspace({ workspace: option }));
        setIsOpen(false);
        navigate("/canvas");
    };

    return (
        <div className="landing-page">
            <img className='bg-image' src={BackgroundImage} alt="bg" />
            <div className='left-container'>
                <img className='logo-image' src={Logo} alt="logo" />
                <div className='button-group'>
                    {user ? <>
                        {currentWorkspace ? <button onClick={() => navigate("/canvas")}>Go to Canvas</button> : <button onClick={handleCreateWorkspace}>Create New Workspace</button>}
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
                        <button onClick={handleLogout}>Logout</button>
                    </> : <>
                        {currentWorkspace ? <button onClick={() => navigate("/canvas")}>Go to Canvas</button> : <button onClick={handleCreateWorkspace}>Create Anonymous Workspace</button>}
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/signup')}>Sign Up</button>
                    </>}
                </div>
            </div>
            <div className='right-container'>
                <img className='demo-gif' src={DemoVideo}></img>
            </div>
        </div >
    )
}

export default LandingPage

