// src/(auth)/login/page.tsx
"use client"
import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import {useRouter}  from 'next/navigation';
import { Container } from '@/components/Container';
import { AuthLayout } from '@/components/AuthLayout';
import { TextField } from '@/components/Fields';
import { Button } from '@/components/Button';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
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

      const responseData = await response.json();
      localStorage.setItem('token', responseData.data.token);
      localStorage.setItem('justLogin', 'true');
      // setError(null);

      // 获取用户信息
      await fetchUserInfo();
      router.push('/info');
    } catch (error: any) {
      // setError(error.message);
    }
  };

  useEffect(() => {
    const justRegister = localStorage.getItem('justRegister');
    if (justRegister) {
      setShow(true);
      localStorage.removeItem('justRegister'); // 移除标记
    }

    if (!show) return;
    const timer = setTimeout(() => {
      setShow(false);
    }, 3333);

    return () => clearTimeout(timer); // 清除定时器
  }, [show]);

  return (
    <Container>
      <>
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <Transition
              show={show}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">Successfully registered!</p>
                      <p className="mt-1 text-sm text-gray-500">You can now login.</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          setShow(false)
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </>
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
