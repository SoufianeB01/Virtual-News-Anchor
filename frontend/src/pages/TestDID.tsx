
import { useEffect } from 'react';

export default function TestDID() {
  useEffect(() => {
    if (document.getElementById('did-agent-script')) return;

    const script = document.createElement('script');

    script.id = 'did-agent-script';
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';

    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', 'ck_uaIJQpNUPPUEaaJolfECL');
    script.setAttribute('data-agent-id', 'v2_agt_FcKFeake');
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-light-mode', 'false');
    script.setAttribute('data-orientation', 'horizontal');
    script.setAttribute('data-position', 'right');
    script.setAttribute('data-open-mode', 'expanded');

    script.onload = () => console.log('D-ID script geladen');
    script.onerror = () => console.error('D-ID script laden mislukt');

    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>D-ID Test</h1>
      <p>Testomgeving voor Sam.</p>
    </div>
  );
}
