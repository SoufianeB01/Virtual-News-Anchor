import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'white', color: 'text.primary' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography
            variant="h5"
            color="primary"
            sx={{ flexGrow: 1, fontWeight: 700 }}
            >
          Sam
        </Typography>

        <Button component={RouterLink} to="/">
          Home
        </Button>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="caption">
            Virtual News Anchor
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}