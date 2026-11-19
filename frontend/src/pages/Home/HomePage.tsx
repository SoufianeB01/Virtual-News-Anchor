import { Box, Button, Chip, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { articles } from '../../data/articles';
import './HomePage.css';

export default function HomePage() {
  return (
    <Container maxWidth="lg" className="home-page">
      <Box className="home-intro">
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Ontdek het nieuws met Sam
        </Typography>

        <Typography color="text.secondary">
          Kies een onderwerp en laat Sam het nieuws aan je uitleggen.
        </Typography>
      </Box>

      <Box className="article-grid">
        {articles.map((article) => (
          <Box className="news-card" key={article.id}>
            <Chip
              label={article.category}
              color="primary"
              size="small"
            />

            <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {article.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {article.source} · {article.date}
            </Typography>

            <Typography variant="body2">
              {article.description}
            </Typography>

            <Button
              component={Link}
              to={`/article/${article.id}`}
              variant="contained"
            >
              Bekijk met Sam
            </Button>
          </Box>
        ))}
      </Box>
    </Container>
  );
}