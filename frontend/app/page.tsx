import Cam from '../components/CamComponent'
import Users from '../components/UsersComponent'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>实时运动检测</h1>
      <Cam />
      <Users />
    </main>
  );
}
