"use client"
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

const UsersComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const fetchUsers = async () => {
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user data:', error));
  }
  useEffect(() => {
    // Fetch user data from backend when component mounts
    fetchUsers();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then(response => response.json())
      .then(data => {
        // Fetch again to update the user list
        fetchUsers();
        console.log('Success:', data);

        // Clear the input fields
        setUsername('');
        setPassword('');
        setEmail('');
      })
      .catch(error => console.error('Error submitting user data:', error));
  };

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
      });
      // 删除成功后重新获取用户列表
      fetchUsers();

    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <table className="table-auto">
        <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Username</th>
          <th className="px-4 py-2">Password</th>
          <th className="px-4 py-2">Email</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{user.id}</td>
            <td className="border px-4 py-2">{user.username}</td>
            <td className="border px-4 py-2">{user.password}</td>
            <td className="border px-4 py-2">{user.email}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <h2 className="text-xl font-bold my-4">Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      <form onSubmit={handleDelete}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Delete User by ID:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="id"
            type="text"
            placeholder="User ID"
            value={id}
            onChange={e => setId(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
);
};

export default UsersComponent;
