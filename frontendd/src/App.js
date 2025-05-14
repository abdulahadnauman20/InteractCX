import React from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Weather Assistant
        </Typography>
        <Chat />
      </Container>
    </>
  );
}

export default App;