import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButtons({ handleAction }) {
    return (
        <Button variant="contained" onClick={handleAction}>Log in</Button>
    );
}