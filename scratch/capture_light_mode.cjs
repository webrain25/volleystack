const { execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\luca.cupito\\.gemini\\antigravity\\brain\\044aa7e7-1b2f-4033-98ba-344649173280\\chrome_light_profile';

const chrome = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  `--user-data-dir=${userDataDir}`,
  '--remote-debugging-port=9499',
  '--window-size=1440,2200',
  'https://volleystack.pages.dev/'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9499/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const targets = JSON.parse(data);
      const wsUrl = targets[0]?.webSocketDebuggerUrl;
      console.log('WS URL:', wsUrl);
      if (!wsUrl) {
        chrome.kill();
        process.exit(1);
      }
      
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        let id = 1;
        // Toggle theme to light mode and flip card 1
        ws.send(JSON.stringify({
          id: id++,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              document.documentElement.classList.remove('dark');
              localStorage.setItem('volleystack-theme', JSON.stringify({ state: { theme: 'light' }, version: 0 }));
              const themeBtn = document.querySelector('button[aria-label="Toggle theme"]');
              if (themeBtn && document.documentElement.classList.contains('dark')) {
                themeBtn.click();
              }
              // Flip the second card to inspect both front and back
              const cards = document.querySelectorAll('.perspective-1000');
              if (cards.length > 1) {
                cards[1].click();
              }
            `
          }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            id: id++,
            method: 'Page.captureScreenshot',
            params: {}
          }));
        }, 1500);

        ws.onmessage = (msg) => {
          const res = JSON.parse(msg.data);
          if (res.result && res.result.data) {
            fs.writeFileSync('C:/Users/luca.cupito/.gemini/antigravity/brain/044aa7e7-1b2f-4033-98ba-344649173280/live_light_mode_full.png', Buffer.from(res.result.data, 'base64'));
            console.log('Light mode screenshot successfully captured!');
            chrome.kill();
            process.exit(0);
          }
        };
      };
    });
  });
}, 2500);

