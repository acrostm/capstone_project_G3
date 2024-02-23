import { Cam } from '@/components'
import NavBar from '@/components/NavBar';
import UserInfoTable from '../../components/UserInfoTable';
import Footer from '@/components/Footer';
import React from 'react';

export default function Home() {
  const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'AI', href: '/ml', current: true },
    { name: 'Users', href: '/users', current: false },
  ];
  return (
  <div className="flex flex-col min-h-screen">
    <NavBar navigation={navigation} />

    <div className="flex-1">
      <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Posture Tracking</h1>
          <Cam />
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
}
