import React from "react";
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
    Button,
    Chip,
} from "@mui/material";

function Navbar() {
    const handleClick = () => { }

    const handleAddClick = () => {

    }

    return (
        <AppBar position="absolute" sx={{ width: '100%', bgcolor: '#fff' }}>
            <CssBaseline />
            <Toolbar sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Chip label='Settings' onClick={handleClick}></Chip>
                <Chip label='Auth' onClick={handleClick}></Chip>
                <Chip label='My App' onClick={handleClick}></Chip>
                <Chip label="Create App" color="info" onClick={handleAddClick} size='small'></Chip>
            </Toolbar>
        </AppBar>
    );
}
export default Navbar;