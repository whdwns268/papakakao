const express = require('express');
const puppeteer = require('puppeteer');
const multer = require('multer');
const kakaologin = require('./kakaologin');
const kakaoMsg = require('./kakaomsg');
const crewdataFind = require('./crewdatafind');
const formDataSave = require('./formDataSave');
const formDataGet = require('./formDataGet');
const setupWebSocketServer = require('./websocketServer');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

let browser;
let page;

const app = express();
app.use(cookieParser());
app.use(express.json()); // JSON 본문을 처리하기 위함
app.use(express.urlencoded({ extended: true })); // URL-encoded 데이터를 처리하기 위함
app.use(express.static(path.join(__dirname, 'build')));


const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  setupWebSocketServer(server);

// 기존의 puppeteer require 아래에 추가
class UserManager {
    constructor() {
        this.users = new Map(); // 사용자 ID와 Puppeteer 인스턴스를 저장할 Map
    }

    async getPuppeteerInstance(userId) {
        if (!this.users.has(userId)) {
            const browser = await puppeteer.launch({
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/app/.apt/usr/bin/google-chrome',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: false // 또는 환경에 맞게 설정
            });
            const page = await browser.newPage();
            await page.setViewport({ width: 600, height: 800 }); // 필요한 경우 설정
            this.users.set(userId, { browser, page }); // 새 인스턴스 저장
        }
        return this.users.get(userId);
    }

    async closePuppeteerInstance(userId) {
        if (this.users.has(userId)) {
            const { browser } = this.users.get(userId);
            await browser.close();
            this.users.delete(userId); // 인스턴스 삭제
        }
    }
}

const userManager = new UserManager();


app.use('/kakaologin', async (req, res, next) => {
    const userData = req.body;
    console.log(userData)
    const { browser, page } = await userManager.getPuppeteerInstance(userData.id);
    
    req.browser = browser;
    req.page = page;

    next();
});

 // 파일명 원본으로 저장
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
     
      const originalName = file.originalname;
      cb(null, originalName);
    }
  });
  
  const upload = multer({ storage: storage });

async function initializePuppeteer() {
    browser = await puppeteer.launch({
        // 서버에서만
        //executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/app/.apt/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        //headless: "New",
        //args: ['--no-sandbox'],
        //executablePath: '/home/ubuntu/.cache/puppeteer/chrome/linux-119.0.6045.105/chrome-linux64/chrome',
        headless: false
    });
    page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 })
}


app.post('/kakaologin', async (req, res) => {
    const userData = req.body;
    const { browser, page } = req;
    console.log("로그인중")
    try {
        const responseApi = await kakaologin({ browser, page, ...userData });
        if (responseApi === 'LOGIN_FAILED') {
            res.status(401).json({ error: '로그인 정보를 확인해주세요.' });
            await userManager.closePuppeteerInstance(userData.id);
            return;
        } else {
            const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey";
            const token = jwt.sign({ id: userData.id }, JWT_SECRET);
            res.cookie('userid', userData.id, { httpOnly: true })
            // 생성된 토큰과 함께 응답 발송
            res.json({ ...responseApi, authToken: token,});
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/kakaomsg', upload.any(), async (req, res) => {
    const userData = req.body;
    const userFiles = req.files;
    const { browser, page } = req;
    try {
        const responseApi = await kakaoMsg({ browser, page, ...userData , userFiles});
        if (responseApi === 'MSG_FAILED') {
            res.status(401).json({ error: '메시지 전송에 실패하였습니다.' });
            return;
        }
        res.json(responseApi);
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/crewdatafind', async (req, res) => {
    const userData = req.body;
    console.log(userData);
    try {
        
        const responseApi = await crewdataFind({...userData});
        if (responseApi === 'MSG_FAILED') {
            res.status(401).json({ error: '메시지 전송에 실패하였습니다.' });
            return;
        }
        res.json(responseApi);
    } catch (error) {
        console.error('Error during data retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/formDataSave', async (req, res) => {
    const userData = req.body;

    try {
        
        const responseApi = await formDataSave({...userData});
        if (responseApi === 'MSG_FAILED') {
            res.status(401).json({ error: '저장에 실패 하였습니다.' });
            return;
        }
        res.json(responseApi);
    } catch (error) {
        console.error('Error during data retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/formDataGet', async (req, res) => {

    try {
        const responseApi = await formDataGet();
        if (responseApi === 'MSG_FAILED') {
            res.status(401).json({ error: '데이터 가져오기에 실패 하였습니다.' });
            return;
        }
        res.json(responseApi);
    } catch (error) {
        console.error('Error during data retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/*', (req, res) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Date: Date.now(),
    });
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
