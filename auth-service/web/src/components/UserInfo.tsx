import React from 'react';
import { Box, Typography } from '@mui/material';

interface UserInfoProps {
    email?: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ email }) => {
    return (
        <Typography variant="body1">
            Welcome, {email || 'Guest'}
        </Typography>
    );
};

export default UserInfo;
