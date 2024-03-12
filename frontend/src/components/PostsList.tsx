import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
// import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
// import { formatDate } from '@/lib/formatDate'



export function PostList() {
  // let articles = await getAllArticles()

  return (
    <Container className="md:grid md:grid-cols-4 md:items-baseline mt-10 border-spacing-2">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/:i`} className="text-zinc-800 font-bold">
          title
        </Card.Title>
        <Card.Description>description</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={ Date() }
        className="mt-1 hidden md:block"
      >
        2024.03.12 | 14:35
      </Card.Eyebrow>
    </Container>
  )
}
