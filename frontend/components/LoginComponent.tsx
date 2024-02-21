// src/components/LoginComponent.tsx
"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { TextField, Button } from '@mui/material';
import UserInfoTable from './UserInfoTable';
import SnackbarComponent from './SnackbarComponent'

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
        throw new Error('Failed to get user\'s information');
      }

      const userInfoData = await response.json();
      setUserInfo(userInfoData);
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
      setShowLogin(false); // 登录成功后隐藏登录界面
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
        <div className="bg-white p-4 rounded shadow-md w-96">
          <h2 className="text-2xl mb-4">Login</h2>
          {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <TextField required className='w-full' id="username" label="Username" value={username}
                error={error ? true : false}
                helperText={error}
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
            <Button type="submit" variant="outlined" className='w-full'>Sign In</Button>
          </form>

          <div className="mt-2 text-center">
            <Link href="/users/register" className="hover:underline" style={{ color: 'rgb(144, 202, 249)' }}>
              Sign Up
            </Link>
          </div>
        </div>
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
