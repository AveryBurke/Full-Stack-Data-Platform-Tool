import Container from '@/app/components/Container';
import QueryForm from '@/app/components/QueryInput';

export default function Home() {
  const dev = process.env.NODE_ENV === 'development';
  return (
    <Container>
      <QueryForm />
    </Container>
  );
}
