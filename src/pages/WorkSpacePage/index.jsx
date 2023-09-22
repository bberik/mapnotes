import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCreateWorkspaceMutation, useFetchWorkspaceByIdQuery } from '../../app/workspace/workspaceApiSlice'
import { selectCurrentWorkspace, setWorkspace } from '../../app/workspace/workspaceSlice'
import Canvas from '../../components/Canvas'
import Navbar from '../../components/Header'

const WorkSpacePage = () => {
    const navigate = useNavigate();
    const workspace_id = useSelector(selectCurrentWorkspace);


    const {
        data: workspace,
        isLoading,
        isError,
        error,
        refetch,
    } = useFetchWorkspaceByIdQuery(workspace_id);

    useEffect(() => { refetch() }, [navigate])







    return (
        <div>
            {window.innerWidth >= 1024 ?
                <>
                    <Navbar workspace={workspace}></Navbar>
                    <Canvas workspace={workspace} ></Canvas>
                </>
                : <div style={{ padding: '20px' }}>For better user experience, the service is accessible exclusively through web browsers. Please access using your laptop's web browser. Thank you for your cooperation.</div>
            }
        </div>
    )
}

export default WorkSpacePage