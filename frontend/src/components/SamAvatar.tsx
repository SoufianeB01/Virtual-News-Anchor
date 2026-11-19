
import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { createMascotteSession } from '../services/mascotteService';

interface MascotteMessage {
  role: string;
  text: string;
}

interface MascotteInstance {
  on: (event: string, callback: (data?: any) => void) => void;
  say: (text: string) => void;
  send: (text: string) => void;
  end: () => void;
}

interface MascotteSDK {
  mount: (
    selector: string,
    options: { url: string }
  ) => MascotteInstance;
}

declare global {
  interface Window {
    Mascotte?: MascotteSDK;
  }
}

interface SamAvatarProps {
  onReady?: (instance: MascotteInstance | null) => void;
  onStarted?: () => void;
  onEnded?: () => void;
  onMessage?: (message: MascotteMessage) => void;
}

let sdkPromise: Promise<void> | null = null;

function loadMascotteSDK(): Promise<void> {
  if (window.Mascotte) {
    return Promise.resolve();
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = 'https://app.mascotte.ai/web/embed.js';
      script.onload = () => resolve();
      script.onerror = () => {
        sdkPromise = null;
        reject(new Error('Mascotte SDK laden mislukt'));
      };

      document.body.appendChild(script);
    });
  }

  return sdkPromise;
}

export default function SamAvatar({
  onReady,
  onStarted,
  onEnded,
  onMessage,
}: SamAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<MascotteInstance | null>(null);

  const callbacksRef = useRef({
    onReady,
    onStarted,
    onEnded,
    onMessage,
  });

  callbacksRef.current = {
    onReady,
    onStarted,
    onEnded,
    onMessage,
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const session = await createMascotteSession();

        if (cancelled) return;

        await loadMascotteSDK();

        if (
          cancelled ||
          !containerRef.current ||
          !window.Mascotte
        ) {
          return;
        }

        const instance = window.Mascotte.mount(
          '#sam-avatar',
          { url: session.url }
        );

        instanceRef.current = instance;

        instance.on('ready', () => {
          if (cancelled) return;

          callbacksRef.current.onReady?.(instance);
          setLoading(false);
        });

        instance.on('started', () => {
          if (cancelled) return;
          callbacksRef.current.onStarted?.();
        });

        instance.on('message', (data?: any) => {
          if (cancelled || !data) return;

          callbacksRef.current.onMessage?.({
            role: data.role ?? 'assistant',
            text: data.text ?? '',
          });
        });

        instance.on('ended', () => {
          if (cancelled) return;
          callbacksRef.current.onEnded?.();
          callbacksRef.current.onReady?.(null);
          instanceRef.current = null;
        });

        instance.on('error', (data?: any) => {
          if (cancelled) return;

          console.error('Mascotte error:', data);
          setError('Er is iets misgegaan met Sam.');
          setLoading(false);
        });

        // Fallback voor SDK-versies waarin ready
        // al is verstuurd voordat de listener bestaat.
        callbacksRef.current.onReady?.(instance);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Onbekende fout'
        );

        setLoading(false);
      }
    }

    initialize();

    return () => {
      cancelled = true;

      if (instanceRef.current) {
        instanceRef.current.end();
        instanceRef.current = null;
      }
    };
  }, []);

  return (
    <Box
      id="sam-avatar"
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            color: 'white',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <CircularProgress size={24} color="inherit" />
          <Typography>Sam wordt geladen...</Typography>
        </Box>
      )}

      {error && (
        <Typography
          color="error"
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 6,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}