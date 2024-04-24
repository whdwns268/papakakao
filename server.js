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

let puppeteerEnv = {
    executablePath: '/home/ubuntu/.cache/puppeteer/chrome/linux-119.0.6045.105/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: "New"
    //headless: false
}

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
            let browser = await puppeteer.launch(puppeteerEnv);
            let page = await browser.newPage();
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

app.use('/kakaologin', async (req, res, next) => {
    const userData = req.body;
    console.log(userData)
    const { browser, page } = await userManager.getPuppeteerInstance(userData.id);
    req.browser = browser;
    req.page = page;
    next();
});


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
        let { browser, page } = await userManager.getPuppeteerInstance(userId);
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
    const userId = req.cookies['userid'];
    try {
        let { browser, page } = await userManager.getPuppeteerInstance(userId);
        if (!browser) {
            throw new Error('브라우저 인스턴스가 없습니다.');
        } else {
            page = await browser.newPage();
            const responseApi = await bizCreate({ browser, page, ...userData });
            if (responseApi === 'MSG_FAILED') {
                res.status(401).json({ error: '메시지 전송에 실패하였습니다.' });
                
                return;
            } else {
                await page.close();
            }
            res.json(responseApi);
            
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        await page.close();
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//hr 스크래핑
app.get('/scrape', async (req, res) => {
    let vacationData = [];  // vacationData 변수를 초기화

    try {
        const browser = await puppeteer.launch(puppeteerEnv);
        const page = await browser.newPage();

        const loginUrl = 'https://papa.hr.crew-admin.papa-service.com/login?callbackUrl=https%3A%2F%2Fpapa.hr.crew-admin.papa-service.com%2F';

        await page.goto(loginUrl);

        // 아이디와 비밀번호 입력
        await page.type('#mui-2', 'papa003@papamobility.com');
        await page.type('#mui-3', 'papa1234!');

        // 로그인 버튼 클릭
        await page.click('.MuiButton-contained.MuiButton-containedPrimary');

        // 로그인 후 페이지가 로드될 때까지 기다림
        await page.waitForNavigation();

        const cookies = await page.cookies();
        const sessionTokenCookie = cookies.find(cookie => cookie.name === '__Secure-next-auth.session-token');

        if (sessionTokenCookie) {
            // 엔드포인트 호출
            const endpointUrl = 'https://papa.hr.crew-admin.papa-service.com/api/employees/vacation-list';
            await page.goto(endpointUrl);

            // 여기서 response를 처리하거나 결과를 콘솔에 출력할 수 있음
            const responseData = await page.evaluate(() => {
                return JSON.parse(document.body.textContent);
            });
            console.log(responseData);
            const firstItemId = responseData.data.list[0].id;

            console.log('첫 번째 아이템의 id:', firstItemId);

            // firstItemId를 기준으로 반복
            for (let i = 1; i <= firstItemId; i++) {
                const dynamicUrl = `https://papa.hr.crew-admin.papa-service.com/api/employees/vacation-list?wfId=${i}`;

                await page.goto(dynamicUrl);

                const responseData2 = await page.evaluate(() => {
                    return JSON.parse(document.body.textContent);
                });

                console.log(`동적으로 생성된 API 응답 ${i}/${firstItemId}:`, responseData2.data.list);

                // responseData2.data.list 배열이 비어있는지 확인
                if (responseData2.data.list.length > 0) {
                    // 첫 번째 아이템의 connect 항목 출력

                    let status = ""
                    if (responseData2.data.list[0].stepCode == "DRAFT"){
                        status = "기안"
                    } else if (responseData2.data.list[0].stepCode == "ING"){
                        status = "진행"
                    } else if (responseData2.data.list[0].stepCode == "COMPLETE"){
                        status = "완료"
                    } else if (responseData2.data.list[0].stepCode == "CANCEL"){
                        status = "취소"
                    } else if (responseData2.data.list[0].stepCode === "REJECT"){
                        status = "반려"
                    } else {
                        status = "확인필요"
                    }

                    let type = ""
                    if (responseData2.data.list[0].vacTypeCode == "VAC001"){
                        type = "유급연차"
                    } else if (responseData2.data.list[0].vacTypeCode == "VAC002"){
                        type = "무급연차"
                    } else if (responseData2.data.list[0].vacTypeCode == "VAC003"){
                        type = "경조사"
                    } else if (responseData2.data.list[0].vacTypeCode == "VAC005"){
                        type = "병가"
                    } else {
                        type = "확인필요"
                    }


                    let division = ""
                    if (responseData2.data.list[0].annualTypeCode == "ANN001"){
                        division = "종일"
                    } else {
                        division = "확인필요"
                    }

                    let startDate = responseData2.data.list[0].startDate.split('T')[0]
                    let endDate = responseData2.data.list[0].endDate.split('T')[0]

                    const vacation = {
                        crewid: responseData2.data.list[0].draftUserId,
                        crewname: responseData2.data.list[0].name,
                        applicationid: responseData2.data.list[0].id,
                        status: status,
                        type: type,
                        division: division,
                        startDate: startDate,
                        endDate: endDate,
                        appliedDate: responseData2.data.list[0].createdAt,
                        reason: responseData2.data.list[0].desc,
                        refusal: responseData2.data.list[0].rejectComment
                    };

                    vacationData.push(vacation);

                    //console.log('첫 번째 Connect 항목:', vacation);
                
                } else {
                    console.log('responseData2.data.list 배열이 비어있습니다.');
                }
            }

            console.log('첫 번째 아이템의 id:', responseData.data.list[0].id);

        } else {
            console.error('세션 토큰 쿠키를 찾을 수 없습니다.');
        }
        
        await browser.close();

        const responseApi = {
            message: 'Scraping successful',
            data: vacationData,
        };

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
