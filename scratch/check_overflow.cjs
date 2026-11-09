const { spawn } = require('child_process');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--window-size=390,844',
  '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'https://volleystack.pages.dev/login'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: {
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          mobile: true
        }
      }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const results = [];
                const all = document.querySelectorAll('*');
                for (let i = 0; i < all.length; i++) {
                  const el = all[i];
                  const r = el.getBoundingClientRect();
                  if (r.right > window.innerWidth + 2 || r.width > window.innerWidth + 2) {
                    results.push({
                      tag: el.tagName,
                      id: el.id,
                      className: (el.className || '').toString().slice(0, 100),
                      text: (el.innerText || '').slice(0, 30),
                      rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) }
                    });
                  }
                }
                return {
                  windowWidth: window.innerWidth,
                  windowHeight: window.innerHeight,
                  scrollWidth: document.documentElement.scrollWidth,
                  bodyScrollWidth: document.body.scrollWidth,
                  overflowingElements: results
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 1000);
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 2) {
        console.log('Result:', JSON.stringify(data.result?.result?.value, null, 2));
        ws.close();
        chrome.kill();
        process.exit(0);
      }
    };
  } catch(e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 3000);
