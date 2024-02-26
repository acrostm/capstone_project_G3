"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [loggedIn, setLoggedIn] = useState(true);
  const router = useRouter();

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
          router.push('/login');
        } else {
          router.push('/info');
        }
      } catch (error) {
        console.error('Error checking user token:', error);
      }
    };

    checkAndRedirect();
  }, [loggedIn]); // 监听 loggedIn 变化



  return null;
}
