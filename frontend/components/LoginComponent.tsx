// src/components/LoginComponent.tsx
"use client"
import React, { useState, useEffect } from 'react';

import { TextField, Button } from '@mui/material';
import UserInfoTable from './UserInfoTable';
import SnackbarComponent from './SnackbarComponent'
import Image from 'next/image';
import Link from 'next/link';

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(true); // 控制是否显示登录界面

  useEffect(() => {
    // 检查 localStorage 中是否存在 token，存在则隐藏登录界面
    if (localStorage.token) {
      console.log('Token exists:', localStorage.token);
      setShowLogin(false);
      // 获取用户信息
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });

      if (!response.ok) {
        handleLogout(); // 获取用户信息失败，清除 localStorage 中的 token, 要求重新登录
        throw new Error('Failed to get user\'s information');
      }

      const userInfoData = await response.json();
      setUserInfo(userInfoData);
      setShowLogin(false); // 登录成功后隐藏登录界面
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
      setError(null);

      // 获取用户信息
      await fetchUserInfo();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    // 清除 localStorage 中的 token，并显示登录界面
    localStorage.removeItem('token');
    setShowLogin(true);
    setUserInfo(null); // 清空用户信息
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center relative">
      <SnackbarComponent
        open={open}
        autoHideDuration={1000}
        onClose={() => setOpen(false)}
        message='Sign in success!'
      />

      {showLogin ? ( // 根据 showLogin 状态决定显示哪个界面
        <>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Image
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                width={60}
                height={60}
                alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           id="username" value={username}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                 setUsername(event.target.value);
                               }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input required type="password" id="password" value={password}
                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                 setPassword(event.target.value);
                               }} />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{' '}
                <Link href="/users/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <UserInfoTable userInfo={userInfo?.data} /> {/* 登录成功后显示用户信息表格 */}
          <div className='absolute top-4 right-4'>
            <Button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
              Log Out
            </Button>
          </div>

        </>
      )}
    </div>
  );
};

export default LoginComponent;
