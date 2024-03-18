import Container from '@/app/components/Container';
import Form from '@/app/components/TextInput'

export default function Home() {
  const dev = process.env.NODE_ENV === 'development';
  return (
    <Container>
      <Form enableDeveloperFeedbackButton={dev} />
    </Container>
  );
}
