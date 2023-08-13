import { Box, Divider, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Editor from "@monaco-editor/react";
const handleStyle = { backgroundColor: 'blue' };

export function TextUpdaterNode({ data }) {
    const [value, setValue] = useState("");

    const handleEditorChange = (value) => {
        setValue(value);
    };



    return (
        <>
            <Handle type="target" position={Position.Top} style={{ backgroundColor: 'red' }} />
            <Box
                sx={{
                    width: 600,
                    height: 900,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    border: 'solid',
                    borderWidth: '1px',
                    borderRadius: 2,
                }}
            >
                <Box>
                    <Typography variant='h5'>index.js</Typography>
                </Box>
                <Divider sx={{ width: '100%' }}></Divider>
                <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl" style={{ width: '100%' }}>
                    <Editor
                        height="85vh"
                        width={`100%`}
                        language={"python"}
                        value={value}
                        theme={"dark"}
                        defaultValue="// some comment"
                        onChange={handleEditorChange}
                    />
                </div>
            </Box>
            <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
        </>
    );
}