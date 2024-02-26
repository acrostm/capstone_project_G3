import { Cam } from '@/components'
import { Container } from '@/components/Container'
import React from 'react';

export default function Home() {

  return (
  <Container>
    <div className="top-1/4">
      <h1 className="text-3xl font-bold mb-4">Posture Tracking</h1>
      <Cam />
    </div>
  </Container>
  );
}
