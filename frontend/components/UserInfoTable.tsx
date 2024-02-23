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
  role: 'root' | 'visitor' | 'author'; // 用户角色
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
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl mb-4">User Info</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center mb-4">
              {userInfo.avatar && (
                <img src={userInfo.avatar} alt="Avatar" width={60} height={60} className="w-32 rounded-lg shadow-lg" />
              )}
            </div>
            <table className="table-auto">
              <tbody>
              <tr>
                <td className="border px-4 py-2">Username</td>
                <td className="border px-4 py-2">{userInfo.username}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Auth</td>
                <td className="border px-4 py-2">{userInfo.role}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Email</td>
                <td className="border px-4 py-2">{userInfo.email}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Register Time</td>
                <td className="border px-4 py-2">{userInfo.createTime}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
  );
};

export default UserInfoTable;
