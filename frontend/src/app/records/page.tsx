
import { Container } from '@/components/Container'
import { RecordList } from '@/components/RecordsList'


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
