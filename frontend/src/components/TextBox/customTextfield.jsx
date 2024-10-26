import React from 'react';
import TextField from '@mui/material/TextField';

const CustomTextField = ({ label,type,  name, value, onChange, multiline = false,size,  rows = 1, sx = {} }) => {
    return (
        <TextField
            label={label}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            fullWidth
            variant="outlined"
            margin="normal"
            multiline={multiline}
            rows={multiline ? rows : 1} 
            sx={sx}
            size={size}
        />
    );
};

export default CustomTextField;
