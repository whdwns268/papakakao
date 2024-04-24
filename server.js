const express = require('express');
const puppeteer = require('puppeteer');
const multer = require('multer');
const kakaologin = require('./express/kakaologin');
const kakaoMsg = require('./express/kakaomsg');
const crewdataFind = require('./express/crewdatafind');
const formDataSave = require('./express/formDataSave');
const formDataGet = require('./express/formDataGet');
const crewDataAdd = require('./express/crewDataAdd');
const formDataDelete = require('./express/formDataDelete');

const bizCreate = require('./express/bizCreate');

const setupWebSocketServer = require('./websocketServer');
const cors = require('cors');

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const teercheckUrl = require('./express/teercheckUrl');

const app = express();
app.use(cookieParser());
app.use(express.json()); // JSON 본문을 처리하기 위함
app.use(express.urlencoded({ extended: true })); // URL-encoded 데이터를 처리하기 위함
app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());

// 또는, 특정 도메인에서의 요청만 허용
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/kakaologin', async (req, res, next) => {
    const userData = req.body;
    console.log(userData)
    const { browser, page } = await userManager.getPuppeteerInstance(userData.id);

    req.browser = browser;
    req.page = page;

    next();
});


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
                headless: "New" // 또는 환경에 맞게 설정
                //headless: false,
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
            res.json({ ...responseApi, authToken: token, });
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/kakaomsg', upload.any(), async (req, res) => {
    const userData = req.body;
    const userFiles = req.files;
    const userId = req.cookies['userid'];
    try {
        console.log("kakaomsg :" + userId);
        const { browser, page } = await userManager.getPuppeteerInstance(userId);
        if (!browser) {
            throw new Error('브라우저 인스턴스가 없습니다.');
        } else {
            const responseApi = await kakaoMsg({ browser, page, ...userData, userFiles });
            if (responseApi === 'MSG_FAILED') {
                res.status(401).json({ error: '메시지 전송에 실패하였습니다.' });
                return;
            }
            res.json(responseApi);
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/crewdatafind', async (req, res) => {
    const userData = req.body;
    console.log(userData);
    try {

        const responseApi = await crewdataFind({ ...userData });
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

        const responseApi = await formDataSave({ ...userData });
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

app.post('/crewDataAdd', async (req, res) => {
    try {
        const crewData = req.body;
        const result = await crewDataAdd(crewData); // DB에 데이터 추가
        console.log(result);
        res.status(201).send({ message: 'Data added successfully', result: result });
    } catch (error) {
        res.status(500).send({ message: 'Failed to add data', error: error });
    }
});

app.post('/formDataDelete', async (req, res) => {
    try {
        const formData = req.body;
        const result = await formDataDelete(formData); // DB에 데이터 추가
        console.log("result"+result);
        res.status(201).send({ message: 'Data Delete successfully', result: result });
    } catch (error) {
        res.status(500).send({ message: 'Failed to Delete data', error: error });
    }
});



app.get('/teercheckUrl', async (req, res) => {
    const userData = req.body;
    const userId = req.cookies['userid'];
    if (userId) {
        try {
            console.log("teercheckUser : " + userId);
            const { browser, page } = await userManager.getPuppeteerInstance(userId);

            if (!browser) {
                throw new Error('브라우저 인스턴스가 없습니다.');
            } else {
                const responseApi = await teercheckUrl({ browser, page, ...userData, userId });
                console.log(responseApi);
                if (responseApi === 'FAILED') {
                    res.clearCookie('userid');
                    res.json("no_login");
                    return;
                }
                res.json(responseApi);
                return; // 정상적인 응답 후 함수에서 나옵니다.
            }
        } catch (error) {
            console.error("에러 발생: ", error);
            res.clearCookie('userid');
            res.json("error_puppeteer");
            return; // 함수에서 나옵니다.
        }
    } else {
        // userId가 없을 경우
        res.json("no_userid");
    }
});


//biz 생성
app.post('/bizCreate', upload.any(), async (req, res) => {
    const userData = req.body;
    //const userId = req.cookies['userid'];
    try {
        //console.log("bizCreate :" + userId);
        //const { browser, page } = await userManager.getPuppeteerInstance(userId);
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/app/.apt/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: "New",
        });
        const page = await browser.newPage();
        //await page.setViewport({ width: 600, height: 800 }); // 필요한 경우 설정

        if (!browser) {
            throw new Error('브라우저 인스턴스가 없습니다.');
        } else {
            const responseApi = await bizCreate({ browser, page, ...userData });
            if (responseApi === 'MSG_FAILED') {
                res.status(401).json({ error: '메시지 전송에 실패하였습니다.' });
                
                return;
            } else {
                await browser.close();
            }
            res.json(responseApi);
            
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
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
