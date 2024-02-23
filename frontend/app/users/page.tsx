"use client"
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [loggedIn, setLoggedIn] = useState(true);
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'AI', href: '/ml', current: false },
    { name: 'Users', href: '/users', current: false },
  ];

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });
        setLoggedIn(response.ok);

        if (!loggedIn) {
          router.push('/users/login');
        } else {
          router.push('/users/info');
        }
      } catch (error) {
        console.error('Error checking user token:', error);
      }
    };

    checkAndRedirect();
  }, [loggedIn]); // 监听 loggedIn 变化



  return null;
}
