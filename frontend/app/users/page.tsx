import Layout from '../layout';
import UsersComponent from '../../components/UsersComponent';
import NavBar from '@/components/NavBar';

export default function UsersPage() {
  return (
    <Layout>
      <NavBar />
      <div>
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">Users Page</h1>
          <UsersComponent />
        </div>
      </div>
    </Layout>

  );
}
