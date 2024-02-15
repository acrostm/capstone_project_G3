import { Cam } from '@/components'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <h1>Posture Tracking</h1>
      <Cam />
    </div>

  );
}