import Cam from '@/components/Cam'
import Layout from  '@/app/layout'
import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <Layout>
      <NavBar />
      <div>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1>Posture Tracking</h1>
          <Cam />
        </main>
      </div>
    </Layout>

  );
}