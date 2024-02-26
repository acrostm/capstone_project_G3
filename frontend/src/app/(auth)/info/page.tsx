// src/app/(auth)/info/page.tsx
"use client"
import UserInfoTable from '@/components/UserInfoTable';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/Container'


const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });

      setLoggedIn(response.ok);

      if (!response.ok) {
        router.push('/login');
        throw new Error('Failed to get user\'s information');
      }

      const userInfoData = await response.json();
      setUserInfo(userInfoData.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []); // 监听 loggedIn 变化

  return (
    <Container>
      {userInfo ? <UserInfoTable userInfo={userInfo} /> : <h1>Get user info failed!</h1>}
    </Container>
  );
};

export default UserInfoPage;
