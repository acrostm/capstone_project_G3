"use client"
import { SnackbarProps } from '@/types';
import React from 'react';
import { Snackbar, Alert } from '@mui/material';



const SnackbarComponent = ({ open, message, autoHideDuration = 1000, onClose }: SnackbarProps) => {


  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
    >
      <Alert severity="success">{message}</Alert>
    </Snackbar>

  );
};

export default SnackbarComponent;