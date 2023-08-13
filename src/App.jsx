import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { TextUpdaterNode } from './CanvasNode';
import Navbar from './Header';

const initialNodes = [
  { id: '1', type: 'textUpdater', position: { x: 500, y: 500 }, data: { label: '1' } },
  { id: '2', position: { x: 400, y: 100 }, data: { label: 'MyProject' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: 'Settings' } },
  { id: '4', position: { x: 400, y: 100 }, data: { label: 'Auth' } },
];
const initialEdges = [];





export default function App() {
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Navbar></Navbar>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls
          style={{
            display: 'flex',
            flexDirection: 'row',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />

        <MiniMap />
        <Background color='#ccc' variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}