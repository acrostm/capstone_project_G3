// UserInfoTable.tsx
"use client"
import React from 'react';

interface UserInfo {
  username: string;
  email: string;
  avatar?: string; // 用户头像，可选
  createTime: string; // 用户创建时间
  id: string; // 用户 ID
  nickname?: string; // 用户昵称，可选
  role: 'admin' | 'visitor' | 'manager'; // 用户角色
  updateTime?: string; // 用户信息更新时间
}

interface Props {
  userInfo: UserInfo | null;
}

const UserInfoTable: React.FC<Props> = ({ userInfo }) => {
  if (!userInfo) {
    return null;
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-28 ml-9 mr-9">
      <div className="px-4 py-6 sm:px-6 flex justify-center items-center">
        <span className="relative inline-block h-18 w-18 rounded-full">
          <img
            className="max-h-full max-w-full rounded-full"
            src={ userInfo.avatar || "https://www.gravatar.com/avatar/" }
            alt="avatar"
          />
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-400 ring-2 ring-white" />
        </span>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Username</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.username}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Email</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.email}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">User Role</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.role}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Register Time</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.createTime}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">About</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
              qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
              pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default UserInfoTable;
