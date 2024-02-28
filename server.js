const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const kakaologin = require('./kakaologin');
const kakaoMsg = require('./kakaomsg');

const app = express();
const port = 3000;

app.use(express.json());  // 이 라인을 라우트 핸들러 밖으로 이동시킵니다.

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use(express.static(path.join(__dirname, 'build')));

app.post('/kakaologin', async (req, res) => {
    const userData = req.body;
    console.log(userData);
    try {
        const responseApi = await kakaologin(userData);
        console.log(responseApi);
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
    console.log(userData);
    try {
        const responseApi = await kakaologin(userData);
        console.log(responseApi);
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
