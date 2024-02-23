// pages/users/info.tsx
"use client"
import UserInfoTable from '@/components/UserInfoTable';
import React from 'react';
import { useState, useEffect } from 'react';
import { router } from 'next/client';
import { NavBar } from '@/components';
import Footer from '@/components/Footer';

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'AI', href: '/ml', current: false },
  { name: 'Users', href: '/users', current: true },
];

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null);

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
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleLogout = () => {
    // 清除 localStorage 中的 token，并显示登录界面
    localStorage.removeItem('token');
    setUserInfo(null); // 清空用户信息
    router.push('/users/login');
  };

  useEffect(() => {
    // 检查 localStorage 中是否存在 token，存在则隐藏登录界面
    if (localStorage.token) {
      console.log('Token exists:', localStorage.token);
      fetchUserInfo();
      console.log('userInfo:', userInfo);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar navigation={navigation} />

      <div className="flex-1">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <UserInfoTable userInfo={userInfo?.data} />
          </div>
        </div>
      </div>


      <footer>
        <div className="w-full">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default UserInfoPage;
