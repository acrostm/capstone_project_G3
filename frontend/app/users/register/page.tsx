// src/users/register/page.tsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TextField, Button } from '@mui/material';
import SnackbarComponent from "@/components/SnackbarComponent"


const Page: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cfPassword, setCfPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== cfPassword) {
      setError("The passwords you entered do not match");
      return;
    }
    setError(null);

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Login failed, please check your username and password');
      }
      setOpen(true);
      let timeout = setTimeout(() => {
        router.replace("/users");
        clearTimeout(timeout);
      }, 1000);


    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Register Page</h2>
        <SnackbarComponent
          open={open}
          autoHideDuration={1000}
          message='Sign up success!'
          onClose={() => setOpen(false)}
        />
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <TextField required className='w-full' id="username" label="Username" value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(event.target.value);
              }} />

          </div>
          <div className="mb-4">
            <TextField required className='w-full' type="password" id="password" label="Password" value={password}
              error={error ? true : false}
              helperText={error}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value);
              }} />
          </div>
          <div className="mb-4">
            <TextField required className='w-full' type="password" id="cfPassword" label="Confirm Password" value={cfPassword}
              error={error ? true : false}
              helperText={error}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCfPassword(event.target.value);
              }} />
          </div>
          <Button type="submit" variant="outlined" className='w-full'>Sign Up</Button>
        </form>

        <div className="mt-2 text-center">
          <Link href="/users" className="hover:underline" style={{ color: 'rgb(144, 202, 249)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>

  );
};

export default Page;
