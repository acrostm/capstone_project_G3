// src/components/LoginComponent.tsx
"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserInfoTable from './UserInfoTable';

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        throw new Error('获取用户信息失败');
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
        throw new Error('登录失败，请检查用户名和密码');
      }

      const responseData = await response.json();
      localStorage.setItem('token', responseData.data.token);

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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      {showLogin ? ( // 根据 showLogin 状态决定显示哪个界面
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-2xl mb-4">登录</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">登录</button>
          </form>
          <div className="mt-2 text-center">
            <Link href="/users/register" className="text-blue-600 hover:underline">
              没有账号？点击注册
            </Link>
          </div>
        </div>
      ) : (
        <>
          <UserInfoTable userInfo={userInfo?.data} /> {/* 登录成功后显示用户信息表格 */}
          <button onClick={handleLogout} className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
            Log Out
          </button>
        </>
      )}
    </div>
  );
};

export default LoginComponent;
