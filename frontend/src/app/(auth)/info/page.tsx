// src/app/(auth)/info/page.tsx
"use client"
import UserInfoTable from '@/components/UserInfoTable';
import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/Container'
import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';


const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });

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
    const justLogin = localStorage.getItem('justLogin');

    if (justLogin) {
      setShow(true);
      localStorage.removeItem('justLogin'); // 移除标记
    }
    if (!show) return;
    const timer = setTimeout(() => {
      setShow(false);
    }, 3333);

    return () => clearTimeout(timer); // 清除定时器
  }, [show]);

  return (
    <Container>
      <>
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-100"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <Transition
              show={show}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">Successfully logged in!</p>
                      <p className="mt-1 text-sm text-gray-500">You can now view and edit your profile.</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          setShow(false)
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </>
      {userInfo ? <UserInfoTable userInfo={userInfo} /> : <h1>Get user info failed!</h1>}
    </Container>
  );
};

export default UserInfoPage;
