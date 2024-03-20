const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// 파일 변경 감지 로직
const watchFile = (fileName, callback) => {
  const watcher = fs.watch(fileName, (eventType, filename) => {
    if (eventType === 'change') {
      callback();
    }
  });
  return watcher; // watcher 반환
};

function setupWebSocketServer(server){
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', function connection(ws) {
    console.log('Client connected');
    const watcher = watchFile(path.join(__dirname, 'screen', 'screenshot1.png'), () => { // watcher 받기
      console.log("이미지파일 변경됨");
      fs.readFile(path.join(__dirname, 'screen', 'screenshot1.png'), (err, data) => {
        if (err) {
          console.error('Failed to read file', err);
          return;
        }
        // 연결된 모든 클라이언트에게 파일 데이터 전송
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      watcher.close(); // 여기서 정상적으로 watcher를 사용할 수 있음
    });
  });

  server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });
};

module.exports = setupWebSocketServer;
