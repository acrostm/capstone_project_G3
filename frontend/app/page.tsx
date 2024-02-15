import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link href="/">
              <p className="text-white font-bold">Home</p>
            </Link>
          </div>
          <div>
            <Link href="/ml">
              <p className="text-white font-bold">AI Workout</p>
            </Link>
          </div>
          <div>
            <Link href="/users">
              <p className="text-white">Users</p>
            </Link>
          </div>
        </div>
      </nav>
      <div>
        <h1>
          Welcome to the Home Page
        </h1>
      </div>
    </main>
  );
}
