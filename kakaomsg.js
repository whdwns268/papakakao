async function kakaomsg({ browser, page, ...userData }) {
    let vacationData = [];  // vacationData 변수를 초기화
    console.log(userData)

    try {
        const dynamicUrl = userData.kakaolink;

        await page.goto(dynamicUrl);
        await page.waitForSelector('#chatWrite');

        //await page.click('#chatWrite');
        //await page.keyboard.type(userData.output);

        const value = userData.output; // 이 부분을 외부로 빼내고

        await page.evaluate((value) => {
            const textarea = document.querySelector('#chatWrite');
            if (textarea) {
                Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(textarea, value);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                console.timeLog(textarea);
            }
        }, value);
        

        // 1초 대기
        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.click('.btn_submit');

        const responseApi = {
            message: 'Scraping successful',
            data: vacationData,
        };
        return responseApi;

    } catch (error) {
        console.log("실패")
        return 'MSG_FAILED' + error;
    }

}

module.exports = kakaomsg;