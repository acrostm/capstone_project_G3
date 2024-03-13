'use client'
import React, { useState } from 'react';
import { type Metadata } from 'next'
import { Container } from '@/components/Container'
import { RecordList } from '@/components/RecordsList'
import { Button } from '@/components/Button';


const Page: React.FC = () => {
  return (
    <Container>
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800">
          Records
        </h1>
      </header>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">Records</span>
        </div>
      </div>
      <RecordList />
    </Container>
  );
}

export default Page;
