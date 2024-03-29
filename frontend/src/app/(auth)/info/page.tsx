// src/app/(auth)/info/page.tsx
"use client"
import UserInfoTable from '@/components/UserInfoTable';
import React from 'react';
import { useState, useEffect } from 'react';
import { Container } from '@/components/Container'
import request from '@/lib/fetchData';


const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const response = await request(true, '/api/user');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <Container>
      {userInfo ? <UserInfoTable userInfo={userInfo} /> : <h1>Get user info failed!</h1>}
    </Container>
  );
};

export default UserInfoPage;
