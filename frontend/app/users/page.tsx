// src/users/page.tsx
import LoginComponent from '@/components/LoginComponent';

export default function UsersPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Users Page</h1>
      <LoginComponent />
    </div>
  );
}
