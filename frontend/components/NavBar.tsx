import React from 'react';
import Link from 'next/link';
import Layout from '@/app/layout';

const NavBar: React.FC = () => {
  return (
    <Layout>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link href="/">
              <p className="text-white font-bold">Home</p>
            </Link>
          </div>
          <div>
            <Link href="/ml">
              <p className="text-white font-bold">AI Workout</p>
            </Link>
          </div>
          <div>
            <Link href="/users">
              <p className="text-white">Users</p>
            </Link>
          </div>
        </div>
      </nav>
    </Layout>

  );
}

export default NavBar;