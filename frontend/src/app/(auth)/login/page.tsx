// src/(auth)/login/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import SnackbarComponent from '@/components/SnackbarComponent'
import Image from 'next/image';
import Link from 'next/link';
import {useRouter}  from 'next/navigation';
import { Container } from '@/components/Container';
import { AuthLayout } from '@/components/AuthLayout';
import { TextField } from '@/components/Fields';
import { Button } from '@/components/Button';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user\'s information');
      }

      const userInfoData = await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
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
      const responseData = await response.json();
      localStorage.setItem('token', responseData.data.token);
      // setError(null);

      // 获取用户信息
      await fetchUserInfo();
      router.push('/info');
    } catch (error: any) {
      // setError(error.message);
    }
  };

  return (
    <Container>
      <SnackbarComponent
        open={open}
        autoHideDuration={1000}
        onClose={() => setOpen(false)}
        message='Sign in success!'
      />
      <AuthLayout
        title="Sign in to account"
        subtitle={
          <>
            Don’t have an account?{' '}
            <Link href="/register" className="text-cyan-600">
              Sign up
            </Link>{' '}
            for a free trial.
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <TextField
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(event.target.value)}}
                />
                <TextField
                  label = "Password"
                  name = "password"
                  type = "password"
                  autoComplete = "current-password"
                  required
                  onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(event.target.value)}}
                    />
                  </div>
                    <Button type="submit" color="cyan" className="mt-8 w-full">
                      Sign in to account
                    </Button>
                  </form>
                  </AuthLayout>
    </Container>
  );
};

export default Login;
