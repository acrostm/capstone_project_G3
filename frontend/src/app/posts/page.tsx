// src/app/posts/page.tsx
import React from 'react';
import { type Metadata } from 'next'
import { Container } from '@/components/Container'
import { PostList } from '@/components/PostsList'
import { Button } from '@/components/Button';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}

const Page: React.FC = () => {
  return (
    <Container>
        <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800">
          Posts about Health
        </h1>
        <p className="mt-6 text-base text-zinc-600">
          Upload your article here
        </p>
      </header>
    <Button href="/posts/create" variant='solid' color='cyan'>Create Article</Button>
      <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-2 text-sm text-gray-500">Articles</span>
      </div>
    </div>
      <PostList />
    </Container>
  );
}

export default Page;
