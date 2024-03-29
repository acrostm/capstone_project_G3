// src/app/(auth)/register/page.tsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { SelectField, TextField } from '@/components/Fields'
import { showToast } from '@/lib/utils';


const Page: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cfPassword, setCfPassword] = useState('');
  const [role, setRole] = useState('visitor');
  const [email, setEmail] = useState('');
  const router = useRouter()

  // TODO: add error handler to TextField component
  const [userError, setUserError] = useState<string | null>(null);
  const [pswError, setPswError] = useState<string | null>(null);

  const clearError = () => {
    setPswError(null);
    setUserError(null);

  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== cfPassword) {
      setPswError("The passwords you entered do not match");
      return;
    }
    clearError();
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email, role })
      });

      if (response.status >= 500) {
        showToast(response.statusText, 'error')
        throw Error(response.statusText)
      }

      const data = await response.json();
      if (response.ok && data.code === 200) {
        showToast('🎉Successfully registered!', 'success')
        router.push('/login');
      }

      if (!response.ok) {
        const data = await response.json();
        showToast(data.message || 'Register failed, please check your username and password', 'error')
        return
      }
      router.push('/login');
    } catch (error: any) {
      console.error(error)
    }
  };

  return (
    <AuthLayout
      title="Sign up for an account"
      subtitle={
        <>
          Already registered?{' '}
          <Link href="/login" className="text-cyan-600">
            Sign in
          </Link>{' '}
          to your account.
        </>
      }
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="col-span-full gap-6">
          <TextField
            label="Username"
            name="username"
            type="text"
            value={username}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
          />
          {/* TODO: add error handler to TextField component */}
          <TextField
            className="col-span-full"
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            className="col-span-full"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          {/* TODO: add error handler to TextField component */}
          <TextField
            className="col-span-full"
            label="Confirm Password"
            name="cf_password"
            type="password"
            autoComplete="new-password"
            value={cfPassword}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCfPassword(event.target.value);
            }}
          />
          {/* TODO: add error handler to TextField component */}
          <SelectField
            className="col-span-full"
            label="What's your role?"
            name="user_role"
            onChange={event => {
              setRole(event.target.value)
            }}
          >
            <option value="visitor">Visitor</option>
            <option value="manager">Manager</option>
          </SelectField>
        </div>
        <Button type="submit" color="cyan" className="mt-8 w-full">
          Get started today
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
