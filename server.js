const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const kakaologin = require('./kakaologin');
const kakaoMsg = require('./kakaomsg');
const crewdataFind = require('./crewdatafind');
const formDataSave = require('./formDataSave');
const formDataGet = require('./formDataGet');


const app = express();
const port = process.env.PORT || 3000;

let browser;
let page;

async function initializePuppeteer() {
    browser = await puppeteer.launch({
        // 서버에서만
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/app/.apt/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: ['NEW'],
        //args: ['--no-sandbox'],
        //executablePath: '/home/ubuntu/.cache/puppeteer/chrome/linux-119.0.6045.105/chrome-linux64/chrome',
        //headless: false
    });
    page = await browser.newPage();
}

app.use(async (req, res, next) => {
    if (!browser || !page) {
        await initializePuppeteer();
    }
    req.browser = browser;
    req.page = page;

    next();
});

app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use(express.static(path.join(__dirname, 'build')));

app.post('/kakaologin', async (req, res) => {
    const userData = req.body;
    const { browser, page } = req;
    try {
        const responseApi = await kakaologin({ browser, page, ...userData });
        if (responseApi === 'LOGIN_FAILED') {
            res.status(401).json({ error: '로그인 정보를 확인해주세요.' });
            return;
        }
        res.json(responseApi);
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/kakaomsg', async (req, res) => {
    const userData = req.body;
    const { browser, page } = req;
    try {
        const responseApi = await kakaoMsg({ browser, page, ...userData });
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

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
