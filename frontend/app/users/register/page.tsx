// src/users/register/page.tsx

import React from 'react';

const Page: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Register Page</h1>
      <div className="flex flex-col space-y-2">
        <p className="text-lg">账号：user1</p>
        <p className="text-lg">密码：test</p>
      </div>
    </div>
  );
};

export default Page;
