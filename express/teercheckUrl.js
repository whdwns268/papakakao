
async function teercheckUrl({ userId, browser, page, ...userData }) {

    let responseApi;

    try {
        const bizkakaourl = "https://business.kakao.com/dashboard/"
        await page.goto(bizkakaourl)
        let currentUrlPage = await page.url();

        function waitForSelectorWithLabel(page, selector, label) {
            return page.waitForSelector(selector).then(() => label);
        }

        await Promise.race([
            waitForSelectorWithLabel(page, '.group_list', 'group_list'),
            waitForSelectorWithLabel(page, '.set_login', 'set_login')
        ]).then((result) => {
            console.log("result : " + result); // 여기서 'group_list 발견' 또는 'set_login 발견' 중 하나가 출력됩니다.
            if(result === "set_login"){
                responseApi = 'FAILED';
                console.log(responseApi);
            } else if(result === "group_list"){
                responseApi = 'Scraping successful';
                console.log(responseApi);
            }
            console.log("teercheckUrl currentUrl : " + currentUrlPage);
        }).catch((error) => {
            console.log('선택자를 찾는 도중 오류가 발생했습니다.', error);
        });

        return responseApi;

    } catch (error) {
        console.log(currentUrlPage); // 콘솔에 현재 URL을 출력합니다.
        responseApi = 'FAILED';
        return responseApi;
    }

}

module.exports = teercheckUrl;