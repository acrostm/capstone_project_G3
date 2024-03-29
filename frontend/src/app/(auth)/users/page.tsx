"use client"
import request from '@/lib/fetchData';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [loggedIn, setLoggedIn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const response = await request(true, '/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });
        if (response.code === 200) {
          setLoggedIn(response.ok);
        }
      } catch (error) {
        console.error('Error checking user token:', error);
      }
    };

    checkAndRedirect();
  }, [loggedIn, router]); // 监听 loggedIn 变化



  return null;
}
