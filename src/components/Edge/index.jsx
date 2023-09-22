import React, { useEffect } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

import './index.css';

const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    alert(`remove ${id}`);
};

export default function Edge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected
}) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const handleEdgeDelete = (event, id) => {
        // Create a custom DOM event
        const customEvent = new CustomEvent('edgeDelete', { detail: { edgeID: id } });

        // Dispatch the custom event
        window.dispatchEvent(customEvent);
    };


    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 16,
                        // everything inside EdgeLabelRenderer has no pointer events by default
                        // if you have an interactive element, set pointer-events: all
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <button className="edgebutton" style={{ visibility: selected ? 'visible' : 'hidden' }} onClick={(event) => handleEdgeDelete(event, id)}>
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
