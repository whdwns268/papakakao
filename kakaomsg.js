const path = require('path');

async function kakaomsg({ browser, page, ...userData }) {
    let vacationData = [];  // vacationData 변수를 초기화
    console.log(userData.userFiles)

    try {
        const dynamicUrl = userData.kakaolink;
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36');

        await page.goto(dynamicUrl);
        console.log('현재 페이지 URL:', page.url());
        await page.waitForSelector('#chatWrite');

        //await page.click('#chatWrite');
        //await page.keyboard.type(userData.output);

        const prefaceValue = userData.prefaceValue;

        await page.evaluate((value) => {

            const textarea = document.querySelector('#chatWrite');
            if (textarea) {
                Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(textarea, value);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                console.timeLog(textarea);
            }
        }, prefaceValue);

        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.click('.btn_submit');

        await new Promise(resolve => setTimeout(resolve, 1000));

        const value = userData.output;

        await page.evaluate((value) => {
            const textarea = document.querySelector('#chatWrite');
            if (textarea) {
                Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(textarea, value);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                console.timeLog(textarea);
            }
        }, value);

        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.click('.btn_submit');
        await page.screenshot({ path: 'screenshot5.png' });


        // 1초 대기
        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.click('.btn_submit');
        await new Promise(resolve => setTimeout(resolve, 1000));


        if (userData.userFileName !== "" || !userData.userFileName) {

            const userFileName = userData.filesName;
            console.log("찾은 파일:", userFileName);
            let filePath = path.join(__dirname, 'uploads', userFileName);
            console.log(filePath)

            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('.upload_btn'), // 가정: #uploadButton이 파일 선택 창을 여는 버튼의 ID
            ]);

            await fileChooser.accept([filePath]);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("파일 삭제 중 오류가 발생했습니다:", err);
                    return;
                }
                console.log(filePath + " 파일이 성공적으로 삭제되었습니다.");
            });
        }


        const responseApi = {
            message: 'Scraping successful',
            data: vacationData,
        };
        return responseApi;

    } catch (error) {
        console.log("실패:" + error)
        return 'MSG_FAILED' + error;
    }

}

module.exports = kakaomsg;