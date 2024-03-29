async function kakaologin({ browser, page, ...userData }) {
    let vacationData = [];  // vacationData 변수를 초기화
    try {
    const loginUrl = 'https://accounts.kakao.com/login/?continue=https%3A%2F%2Fbusiness.kakao.com%2Fdashboard%2F#login';
    await page.reload();
    await page.goto(loginUrl);

    await page.type('#loginId--1', userData.id);
    await page.type('#password--2', userData.password);

    await page.click('.btn_g.highlight.submit');

    
        console.log("대기")
        // 로그인 버튼을 누른 후 페이지가 변할 때까지 최대 3초 동안 대기
        await page.waitForNavigation({ timeout: 3000 });
        console.log("성공")
        // 페이지가 변했다면 로그인 성공으로 간주
        // 로그인 성공: 이후 처리

        //2fa페이지 대기
        await page.waitForNavigation({ timeout: 300000 });

        await page.waitForSelector('.group_list');
        // 로그인 성공 확인
        const loginSuccess = await page.evaluate(() => {
            // 로그인 성공을 나타내는 요소가 있는지 확인
            return !!document.querySelector('.group_list');
        });

        if (loginSuccess) {
            console.log('로그인 성공!');
        } else {
            console.log('로그인 실패!');
        }



        const responseApi = {
            message: 'Scraping successful',
            data: vacationData,
        };

        return responseApi;

    } catch (error) {
        // 3초 동안 페이지가 변하지 않았다면 로그인 실패로 간주
        console.log("실패")
        return 'LOGIN_FAILED';
    }
}

module.exports = kakaologin;