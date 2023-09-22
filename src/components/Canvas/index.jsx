import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './index.css'
import Node, { RootNode } from '../Node';
import { useCreateNodeMutation, useDeleteNodeMutation, useUpdateNodeMutation } from '../../app/node/nodeApiSlice';
import { useCreateEdgeMutation, useDeleteEdgeMutation } from '../../app/edge/edgeApiSlice';
import Edge from '../Edge';


const annotation =
{
    id: 'hint',
    className: 'annotation',
    data: {
        label: (
            <div>
                Create the root of your mind-map <strong>Give it a title and description.</strong> Good luck 🥳
            </div>
        ),
    },
    draggable: false,
    selectable: false,
    position: { x: 150, y: 400 },
};


const nodeTypes = {
    rootNode: RootNode,
    defaultNode: Node,
};

const edgeTypes = {
    defaultEdge: Edge
}


export default function Canvas({ workspace }) {
    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { project } = useReactFlow();
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showNewNode, setShowNewNode] = useState(false);
    const [isDragging, setIsDragging] = useState(false);


    const [updateNode, updated_node] = useUpdateNodeMutation();
    const [createNode, { data: created_node }] = useCreateNodeMutation();
    const [createEdge, { data: created_edge }] = useCreateEdgeMutation();
    const [deleteEdge, { data: deleted_edge }] = useDeleteEdgeMutation();
    const [deleteNode, { data: deleted_node }] = useDeleteNodeMutation();




    const handleMouseMove = (event) => {
        if (isDragging) {
            const { clientX, clientY } = event;
            setMousePosition({ x: clientX, y: clientY });
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            if (targetIsPane && !showNewNode) {
                setShowNewNode(true)
            } else if (!targetIsPane && showNewNode) {
                setShowNewNode(false)
            }
        }
    };




    const onConnectStart = useCallback((event, { nodeId }) => {
        connectingNodeId.current = nodeId;
        setShowNewNode(true);
        setIsDragging(true);
        const { clientX, clientY } = event;
        setMousePosition({ x: clientX, y: clientY });
        const nodeDivs = document.querySelectorAll(`.react-flow__node:not([data-id="${nodeId}"])`);
        if (nodeDivs) {
            nodeDivs.forEach(node => {
                const nodeContainer = node.querySelector('.default-node')
                if (nodeContainer) {
                    nodeContainer.classList.add('default-node-connecting');
                }

            });
        }
    }, []);



    const onConnectEnd = useCallback(
        (event) => {
            setShowNewNode(false);
            setIsDragging(false);

            const nodes = document.querySelectorAll(`.react-flow__node:not([data-id="${connectingNodeId}"])`);
            nodes.forEach(node => {
                const nodeContainer = node.querySelector('.default-node')
                if (nodeContainer) {
                    nodeContainer.classList.remove('default-node-connecting');
                }

            });

            const targetIsPane = event.target.classList.contains('react-flow__pane');
            if (targetIsPane) {
                const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
                const position = project({ x: event.clientX - left - 75, y: event.clientY - top })

                createNode({ workspace: workspace.id, x: Math.floor(position.x), y: Math.floor(position.y) }).then(response => {
                    const newNode = {
                        id: response.data.id,
                        position: { x: response.data.x, y: response.data.y },
                        type: 'defaultNode',
                        data: { title: response.data.title, body: response.data.body, is_expanded: response.data.is_expanded }
                    };
                    setNodes((nds) => nds.concat(newNode));
                    createEdge({ workspace: workspace.id, source: connectingNodeId.current, target: response.data.id }).then(response => {
                        setEdges((eds) => eds.concat({ id: response.data.id, source: response.data.source, target: response.data.target, type: 'defaultEdge' }));
                    });
                })
                return;

            }

            const closestNode = event.target.closest('.react-flow__node')
            if (closestNode) {
                const dataId = closestNode.getAttribute('data-id');
                const edgeAlreadyExists = edges.some(edge =>
                    edge.source === connectingNodeId.current && edge.target === dataId
                );
                if (!edgeAlreadyExists && connectingNodeId.current !== dataId) {
                    createEdge({ workspace: workspace.id, source: connectingNodeId.current, target: dataId }).then(response => {
                        setEdges((eds) => eds.concat({ id: response.data.id, source: response.data.source, target: response.data.target, type: 'defaultEdge' }));
                    });
                }

            }


        },
        [project, workspace, edges]
    );

    useEffect(() => {
        if (workspace && workspace.nodes.length !== 0) {
            const fetchedNodes = workspace.nodes.map(node => ({
                id: node.id,
                type: 'defaultNode',
                data: { title: node.title, body: JSON.parse(node.body), is_expanded: node.is_expanded },
                position: { x: node.x, y: node.y },
            }))
            const fetchedEdges = workspace.edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: 'defaultEdge',
            }))
            setNodes((nds) => nds.concat(fetchedNodes));
            setEdges((eds) => eds.concat(fetchedEdges))
        }
        else if (workspace && workspace.nodes.length === 0) {
            createNode({ workspace: workspace.id, x: 400, y: 400 }).then(response => {
                setNodes((nds) => nds.concat(
                    [
                        annotation, { id: response.data.id, type: 'rootNode', data: { title: response.data.title, body: response.data.body, is_expanded: response.data.is_expanded }, position: { x: response.data.x, y: response.data.y } }
                    ]
                ))
            })

        }
    }, [workspace])

    const handleNodeDrag = (event, data) => {
        updateNode({ id: data.id, body: { x: Math.floor(data.position.x), y: Math.floor(data.position.y) } })
    }

    const handleEdgeDelete = (event) => {
        deleteEdge(event.detail.edgeID).then(response => {
            setEdges((eds) => eds.filter((e) => e.id !== event.detail.edgeID));
        }
        )
    }

    const handleNodeDelete = (event) => {
        console.log(event)
        deleteNode(event.detail.nodeID).then(response => {
            setNodes((nds) => nds.filter((n) => n.id !== event.detail.nodeID));
        }
        )
    }

    useEffect(() => {
        window.addEventListener('edgeDelete', handleEdgeDelete);
        window.addEventListener('nodeDelete', handleNodeDelete);

        return () => {
            window.removeEventListener('edgeDelete', handleEdgeDelete);
            window.removeEventListener('nodeDelete', handleNodeDelete);
        };
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh' }} className="wrapper" ref={reactFlowWrapper} onMouseMove={handleMouseMove}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onNodeDragStop={handleNodeDrag}
                deleteKeyCode={null}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
            <div className='new-node' style={{
                top: mousePosition.y + 20,
                left: mousePosition.x - 40,
                display: isDragging ? 'block' : 'none',
                border: showNewNode ? '2px dashed #222' : 'none'
            }}><span>
                    {showNewNode ? 'New Node' : 'Connect'}
                </span></div>
        </div>
    );
}