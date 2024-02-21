// UserInfoTable.tsx
import React from 'react';
import Image from 'next/image'; // Import the Image component

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

  console.log('User Info:', userInfo, typeof userInfo);

  return (
    <div className="bg-white p-4 rounded shadow-md w-96">
      <h2 className="text-2xl mb-4">User Info</h2>
      <div className="flex justify-center mb-4">
        {userInfo.avatar && (
          <div className="rounded-full overflow-hidden w-20 h-20">
            <Image src={userInfo.avatar} alt="Avatar" width={80} height={80} className="rounded-full" priority />
          </div>
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
  );
};

export default UserInfoTable;
