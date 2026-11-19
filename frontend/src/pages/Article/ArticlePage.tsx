import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import { articles } from '../../data/articles';
import SamAvatar from '../../components/SamAvatar';
import './ArticlePage.css';

interface MascotteInstance {
  on: (event: string, callback: (data?: any) => void) => void;
  say: (text: string) => void;
  send: (text: string) => void;
  end: () => void;
}

interface ChatMessage {
  role: string;
  text: string;
}

export default function ArticlePage() {
  const { id } = useParams();

  const selectedArticle = articles.find(
    (item) => item.id === Number(id)
  );

  const mascotteRef = useRef<MascotteInstance | null>(null);

  const [connected, setConnected] = useState(false);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [subtitle, setSubtitle] = useState('');

  function sendMessage(text: string) {
    const message = text.trim();

    if (!message || !started || !mascotteRef.current) {
      return;
    }

    mascotteRef.current.send(message);
    setInput('');

    setMessages((previous) => [
      ...previous,
      { role: 'user', text: message },
    ]);
  }

  function handleMascotteMessage(message: ChatMessage) {
    if (!message.text) return;

    // Eigen berichten worden al direct weergegeven.
    if (message.role === 'user') return;

    setMessages((previous) => [...previous, message]);

    if (
      message.role === 'assistant' ||
      message.role === 'mascotte'
    ) {
      setSubtitle(message.text);
    }
  }

  function sendArticleQuestion(question: string) {
    if (!selectedArticle) return;

    const prompt = `
We bespreken het volgende nieuwsartikel:

Titel: ${selectedArticle.title}
Beschrijving: ${selectedArticle.description}
Bron: ${selectedArticle.source}

Vraag: ${question}

Geef een kort en duidelijk antwoord in begrijpelijk
Nederlands voor jongeren van 12 tot 17 jaar.

Gebruik alleen informatie die bekend is.
Verzin geen feiten.
`;

    sendMessage(prompt);
  }

  if (!selectedArticle) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography>
          Artikel niet gevonden.
        </Typography>

        <Button component={Link} to="/">
          Terug naar home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="article-page">
      <Button component={Link} to="/" sx={{ mb: 2 }}>
        ← Terug naar nieuws
      </Button>

      {/* Artikelinformatie */}
      <Box className="article-heading">
        <Chip
          label={selectedArticle.category}
          color="primary"
          size="small"
        />

        <Typography
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          {selectedArticle.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {selectedArticle.source} · {selectedArticle.date}
        </Typography>
      </Box>

      <Box className="article-layout">
        {/* Digital Human */}
        <Box>
          <Box className="sam-screen">
            <SamAvatar
              onReady={(instance) => {
                mascotteRef.current = instance;
                setConnected(Boolean(instance));
              }}
              onStarted={() => {
                setStarted(true);
              }}
              onEnded={() => {
                setStarted(false);
                setConnected(false);
                mascotteRef.current = null;
              }}
              onMessage={handleMascotteMessage}
            />

            <Chip
              label="AI-presentator"
              size="small"
              className="sam-ai-label"
            />

            {/* Ruimte voor nieuwsafbeeldingen */}
            <Box className="sam-visual-overlay" />
          </Box>

          {/* Ondertiteling onder het videoscherm */}
          {subtitle && (
            <Box className="sam-subtitles">
              <Typography variant="body2">
                {subtitle}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Interactiepaneel */}
        <Paper
          variant="outlined"
          className="interaction-panel"
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Praat met Sam
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {selectedArticle.description}
          </Typography>

          {/* Verbindingsstatus */}
          <Typography
            variant="caption"
            color={
              started
                ? 'success.main'
                : 'text.secondary'
            }
          >
            {started
              ? 'Sam is actief. Je kunt vragen stellen.'
              : connected
                ? 'Klik op Start het gesprek bij Sam.'
                : 'Sam wordt verbonden...'}
          </Typography>

          {/* Voorgestelde vragen */}
          <Stack
            spacing={2}
            className="interaction-actions"
          >
            <Button
              variant="outlined"
              fullWidth
              disabled={!started}
              onClick={() =>
                sendArticleQuestion(
                  'Geef meer context bij dit nieuws.'
                )
              }
            >
              Meer context
            </Button>

            {selectedArticle.questions.map((question) => (
              <Button
                key={question}
                variant="outlined"
                fullWidth
                disabled={!started}
                onClick={() =>
                  sendArticleQuestion(question)
                }
              >
                {question}
              </Button>
            ))}

            <Button
              variant="outlined"
              fullWidth
              disabled={!started}
              onClick={() =>
                sendArticleQuestion(
                  'Help mij mijn eigen mening te vormen. Stel mij een vraag.'
                )
              }
            >
              Wat vind jij hiervan?
            </Button>
          </Stack>

          {/* Chatgeschiedenis */}
          {messages.length > 0 && (
            <Box className="chat-history">
              {messages.map((message, index) => (
                <Box
                  key={index}
                  className={
                    message.role === 'user'
                      ? 'chat-message user'
                      : 'chat-message sam'
                  }
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700 }}
                  >
                    {message.role === 'user'
                      ? 'Jij'
                      : 'Sam'}
                  </Typography>

                  <Typography variant="body2">
                    {message.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Eigen vraag stellen */}
          <Box className="chat-input">
            <TextField
              fullWidth
              size="small"
              placeholder="Stel je vraag..."
              value={input}
              disabled={!started}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
            />

            <Button
              variant="contained"
              disabled={!started || !input.trim()}
              onClick={() => sendMessage(input)}
            >
              Verstuur
            </Button>
          </Box>

          {/* Transparantie */}
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Sam is een AI-presentator. Controleer
            informatie bij de oorspronkelijke nieuwsbron.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}