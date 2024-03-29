// src/(auth)/login/page.tsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Container } from '@/components/Container';
import { AuthLayout } from '@/components/AuthLayout';
import { TextField } from '@/components/Fields';
import { Button } from '@/components/Button';
import { showToast } from '@/lib/utils';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isLoading) return
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.status >= 500) {
        showToast(response.statusText, 'error')
        throw Error(response.statusText)
      }
      const responseData = await response.json();
      setIsLoading(false)
      if (responseData.code === 200) {
        localStorage.setItem('token', responseData.data.token);
        localStorage.setItem('justLogin', 'true');

        const redirect_url = localStorage.getItem('redirect_url')
        if (redirect_url) {
          localStorage.removeItem('redirect_url')
          router.replace(redirect_url as string)
        } else {
          router.push('/info');
        }
      } else {
        showToast(responseData.message, 'error')
      }

    } catch (error: any) {
      setIsLoading(false)
      console.error(error)
    }
  };

  return (
    <Container>
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
                setUsername(event.target.value)
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
              }}
            />
          </div>
          <Button type="submit" disabled={isLoading} isLoading={isLoading} color="cyan" className="mt-8 w-full">
            Sign in to account
          </Button>
        </form>
      </AuthLayout>
    </Container>
  );
};

export default Login;
