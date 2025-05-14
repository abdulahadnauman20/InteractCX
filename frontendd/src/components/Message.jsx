// Message.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Message = ({ text, sender }) => {
  return (
    <Box className={`message ${sender}`}>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};

export default Message;
