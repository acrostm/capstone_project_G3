
import { Container } from '@/components/Container'
import RecordList from '@/components/RecordsList'


/**
 * Record Entity:
 * Record: {
 *   date: '2024-03-08',
 *   time: '18:00',
 *   curls_count: 10,
 *   squats_count: 10,
 *   bridges_count: 10
 * }
 */


const Page: React.FC = () => {
  return (
    <Container>
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800">
          Records
        </h1>
      </header>
      <RecordList />
    </Container>
  );
}

export default Page;
