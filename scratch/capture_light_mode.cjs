const { execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\luca.cupito\\.gemini\\antigravity\\brain\\044aa7e7-1b2f-4033-98ba-344649173280\\chrome_mobile_test';

const chrome = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  `--user-data-dir=${userDataDir}`,
  '--remote-debugging-port=9499',
  '--window-size=390,844',
  'https://volleystack.pages.dev/login'
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
        ws.send(JSON.stringify({
          id: id++,
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
            id: id++,
            method: 'Page.captureScreenshot',
            params: {}
          }));
        }, 1500);

        ws.onmessage = (msg) => {
          const res = JSON.parse(msg.data);
          if (res.result && res.result.data) {
            fs.writeFileSync('C:/Users/luca.cupito/.gemini/antigravity/brain/044aa7e7-1b2f-4033-98ba-344649173280/mobile_login_real.png', Buffer.from(res.result.data, 'base64'));
            console.log('Mobile screenshot successfully captured!');
            chrome.kill();
            process.exit(0);
          }
        };
      };
    });
  });
}, 3000);

