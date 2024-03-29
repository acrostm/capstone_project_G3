"use client"
import React, { useEffect } from 'react';

import { Cam } from '@/components'
import { Container } from '@/components/Container'
import request from '@/lib/fetchData';

export default function Home() {
  useEffect(() => {
    checkIsLogin()
  }, [])

  const checkIsLogin = async () => {
    try {
      await request(true, '/api/user');
    } catch (error) {
      console.error('Error checking user token:', error);
    }
  };


  return (
    <Container>
      <div className="top-1/4">
        <h1 className="text-3xl font-bold mb-4">Posture Tracking</h1>
        <Cam />
      </div>
    </Container>
  );
}
