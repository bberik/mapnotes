import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import './index.css'
import Collapse from '../../assets/images/collapse.png'
import Expand from '../../assets/images/expand.png'
import Trash from '../../assets/images/trash.png'
import { useUpdateNodeMutation } from '../../app/node/nodeApiSlice';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'




const Node = ({ id, data }) => {
    const [size, setSize] = useState({ width: 500, height: 500 })
    const [isExpanded, setIsExpanded] = useState(data.is_expanded)
    const [title, setTitle] = useState(data.title ? data.title : '')
    const [updateNode, updated_node] = useUpdateNodeMutation()
    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null)
    const handleInitialize = useCallback((instance) => {
        editorCore.current = instance
    }, [])
    const [initialBlocks, setInitialBlocks] = useState(data.body)


    const handleSave = useCallback(async () => {
        const savedData = await editorCore.current.save();
        if (!initialBlocks || JSON.stringify(savedData.blocks) !== JSON.stringify(initialBlocks.blocks)) {
            updateNode({ id: id, body: { body: JSON.stringify(savedData) } })
            setInitialBlocks(savedData)
        }

    }, [])





    const handleExpand = () => {
        setIsExpanded(true);
        updateNode({ id: id, body: { is_expanded: true } })
    }

    const handleCollapse = () => {
        setIsExpanded(false);
        const nodeContainer = document.querySelector(`.react-flow__node[data-id="${id}"]`);
        nodeContainer.style.width = 'min-content';
        nodeContainer.style.height = 'min-content';
        updateNode({ id: id, body: { is_expanded: false } })
    }

    const handleResize = (data) => {
        setSize({ width: data.width, height: data.height })
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleTitleSync = () => {
        updateNode({ id: id, body: { title: title } })
    }


    const handleNodeDelete = () => {
        // Create a custom DOM event
        const customEvent = new CustomEvent('nodeDelete', { detail: { nodeID: id } });

        // Dispatch the custom event
        window.dispatchEvent(customEvent);
    };




    return (
        <>
            {isExpanded ? <>
                <NodeResizer color="#000" isVisible={true} minWidth={500} minHeight={500} onResize={(e, data) => handleResize(data)} />
                <Handle type="source" className='expanded-handle' position={Position.Right} />
                <Handle type="target" className='expanded-handle' position={Position.Left} />
                <div className='default-node expanded-node'
                    style={{
                        width: size.width,
                        height: size.height,
                    }}
                >
                    <div className='expanded-node-header'>
                        <input placeholder='Title' value={title} onChange={handleTitleChange} onBlur={handleTitleSync}></input>
                        <div className='collapse-button'>
                            <img src={Trash} onClick={handleNodeDelete}></img>
                            <img src={Collapse} onClick={handleCollapse}></img>
                        </div>
                    </div>
                    <ReactEditorJS holder={id} defaultValue={initialBlocks} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS}>
                        <div id={id} className='expanded-node-body nodrag' onBlur={handleSave} ></div>
                    </ReactEditorJS>

                </div>
            </> : <>
                <Handle type="source" className='collapsed-handle' position={Position.Right} />
                <Handle type="target" className='collapsed-handle' position={Position.Left} />
                <div className='default-node collapsed-node'>
                    <div className='collapsed-node-title'>
                        <input placeholder='Title' value={title} onChange={handleTitleChange} onBlur={handleTitleSync}></input>
                    </div>
                    <div className='img-container'>
                        <img src={Trash} onClick={handleNodeDelete}></img>
                        <img src={Expand} onClick={handleExpand}></img>
                    </div>
                </div>
            </>
            }

        </>
    );
}

export default memo(Node);

export const RootNode = ({ id, data }) => {
    const [showInput, setShowInput] = useState(false);


    const handleStart = () => {
        setShowInput(true);
    };

    return (
        <>
            {
                !showInput ? <div>
                    <button className='start-button' onClick={handleStart}>
                        +
                    </button>
                </div> :
                    <Node id={id} data={data}></Node>
            }
        </>
    );
};

