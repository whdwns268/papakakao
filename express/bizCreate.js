async function bizCreate({ browser, page, ...userData }) {
    console.log(userData);
    let vacationData = [];  // vacationData 변수를 초기화
    try {
        const context = browser.defaultBrowserContext();
        await context.overridePermissions('https://biz-admin.papamobility.com/', ['geolocation']);
        await page.setGeolocation({ latitude: 37.5665, longitude: 126.9780 });

        const loginUrl = 'https://biz-admin.papamobility.com';
        await page.goto(loginUrl);

        await page.waitForSelector('.mdc-snackbar');

        const inputFields = await page.$$('.mdc-text-field__input');

        await inputFields[0].type('papa003@papamobility.com');
        await inputFields[1].type('jongjun36@');
        await inputFields[2].type('18119871');

        await page.waitForXPath("//button[contains(., '로그인')]");
        const loginButton = await page.$x("//button[contains(., '로그인')]");
        if (loginButton.length > 0) {
            await loginButton[0].click();
        } else {
            console.error('로그인 버튼을 찾을 수 없습니다.');
        }

        //로그인 완료 후 생성
        await new Promise(resolve => setTimeout(resolve, 1000));
        let travelType = userData.travelType;
        console.log(travelType);
        const targetXPath = `//li[contains(., '${travelType}')]`;

       

        // XPath에 해당하는 요소를 기다립니다.
        await page.waitForXPath(targetXPath);
        const targetElements = await page.$x(targetXPath);
        if (targetElements.length > 0) {
            console.log(targetXPath);
            // 요소가 있다면 첫 번째 요소를 클릭합니다.
            await targetElements[0].click();
        } else {
            // 요소를 찾지 못했다면, 로그를 출력합니다.
            console.error(travelType +"이라는 텍스트를 포함한 <li> 요소를 찾을 수 없습니다.");
        }
        await new Promise(resolve => setTimeout(resolve, 1000));

        let periodTime = userData.periodTime;
        await page.evaluate((data) => {
            const selectElement = document.querySelector('.reserve-select-item'); // <select> 태그 선택
            const options = Array.from(selectElement.options); // <option> 태그들을 배열로 변환
            const targetIndex = options.findIndex(option => option.textContent.includes(data)); // "10시간 120km" 텍스트를 포함하는 <option>의 인덱스 찾기
            if (targetIndex !== -1) { // 만약 찾았다면,
                selectElement.selectedIndex = targetIndex; // <select>의 선택된 인덱스를 업데이트
                selectElement.dispatchEvent(new Event('change')); // 변경 사항을 반영하기 위해 change 이벤트 발생
            } else {
                console.error(data + "이라는 텍스트를 포함한 <option> 요소를 찾을 수 없습니다.");
            }
        }, periodTime); // periodTime을 page.evaluate로 전달
        

        // '.mdc-text-field__input' 선택자에 일치하는 모든 요소를 찾음
        const inputs = await page.$$('.mdc-text-field__input');
        let departure = userData.departure;
        if (inputs.length > 0) {
            await inputs[0].type(departure , { delay: 10 });
            await new Promise(resolve => setTimeout(resolve, 500));
            await inputs[0].type(' ', { delay: 10 });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await page.waitForXPath(`//span[contains(., '${departure}')]`);
            let elements = await page.$x(`//span[contains(., '${departure}')]`);
            if (elements.length > 0) {
                await elements[0].click(); // 첫 번째 요소 클릭
            }


            let destination = userData.destination
            await inputs[1].type(destination , { delay: 10 });
            await new Promise(resolve => setTimeout(resolve, 500));
            await inputs[1].type(' ', { delay: 10 });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await page.waitForXPath(`//span[contains(.,  '${destination}')]`);
            elements = await page.$x(`//span[contains(., '${destination}')]`);
            if (elements.length > 0) {
                await elements[0].click(); // 첫 번째 요소 클릭
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
            await page.waitForXPath("//button[contains(., '다음')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x("//button[contains(., '다음')]");
            if (elements.length > 0) {
                await elements[0].click(); // 첫 번째 요소 클릭
            }


            let userselectmonth = userData.reserveMonth;
            let setuserselectmonth = userselectmonth - 1; // 4로 계산됨, 즉 4월
            let userselectday = userData.reserveDay;

            const isAprilIncluded = await page.evaluate((month) => {
                const el = document.querySelector('.svelte-1l81yyd'); // 해당 클래스를 가진 요소를 선택합니다.
                return el ? el.innerText.includes(month + '월') : false; // 요소의 텍스트에 '4월'이 포함되어 있는지 확인합니다.
            }, setuserselectmonth); // 두 번째 인자로 setuserselectmonth 값을 전달합니다.

            if (isAprilIncluded) {
                console.log(setuserselectmonth + '월이 포함된 요소가 있습니다. 추가 작업을 수행합니다.');
                await new Promise(resolve => setTimeout(resolve, 1000));
                // 여기에 조건이 맞을 때 수행할 추가 작업을 넣습니다.
                const elements = await page.$$('.iconify--dashicons');
                if (elements[1]) { // 두 번째 요소가 존재하는지 확인합니다.
                    elements[1].click(); // 두 번째 요소를 클릭합니다.
                }
            } else {
                console.log(setuserselectmonth + '월이 포함된 요소가 없습니다.');
            }

            await page.waitForXPath(`//span[contains(., '${userselectday}')]`); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x(`//span[contains(., '${userselectday}')]`);
            if (elements.length > 0) {
                await elements[0].click(); // 첫 번째 요소 클릭
            }

            let userselectampm = userData.reserveAP;
            let userselectHHtime = userData.reserveHH;
            let userselectMMtime = userData.reserveMM;

            if (userselectampm === "am") {
                await page.waitForXPath("//span[contains(., '오전')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
                elements = await page.$x("//span[contains(., '오전')]");
                if (elements.length > 0) {
                    await elements[0].click(); // 첫 번째 요소 클릭
                }
            } else if (userselectampm === "pm") {
                await page.waitForXPath("//span[contains(., '오후')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
                elements = await page.$x("//span[contains(., '오후')]");
                if (elements.length > 0) {
                    await elements[0].click(); // 첫 번째 요소 클릭
                }
            }
            
            await page.waitForXPath(`//li[contains(., '${userselectHHtime}')]`); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x(`//li[contains(., '${userselectHHtime}')]`);
            if (elements.length > 0) {
                await elements[0].click(); // 첫 번째 요소 클릭
            }
            
            const targetElementSelector = "ul.flex.justify-between.m-0.p-0 > .svelte-1l81yyd";
            await page.waitForSelector(targetElementSelector); // 해당 요소가 로드될 때까지 기다림

            const targetElement = await page.evaluate((selector, mmTime) => {
                const elements = Array.from(document.querySelectorAll(selector)); // 해당 클래스를 가진 모든 요소를 배열로 변환
                const target = elements.find(el => el.textContent.trim() === mmTime); // 텍스트 콘텐츠가 '30'인 요소 찾기
                if (target) {
                    target.click(); // 찾은 요소 클릭
                    return true;
                }
                return false;
            }, targetElementSelector, userselectMMtime); // userselectMMtime를 인자로 전달
            

            if (!targetElement) {
                console.log(userselectMMtime+"을 포함하는 li 태그를 찾지 못했습니다.");
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.waitForXPath("//button[contains(., '다음')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x("//button[contains(., '다음')]");
            if (elements.length > 0) {
                await elements[1].click(); // 첫 번째 요소 클릭
            }

            let passenger = userData.passenger;
            let passengerPhone = userData.passengerPhone;
            let usePurpose = userData.usePurpose;

            const inputtwo = await page.$$('.mdc-text-field__input');
            
            await inputtwo[2].type(passenger);
            await inputtwo[3].type(passengerPhone);
            await inputtwo[4].type(usePurpose);

            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.waitForXPath("//button[contains(., '다음')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x("//button[contains(., '다음')]");
            if (elements.length > 0) {
                await elements[1].click(); // 첫 번째 요소 클릭
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            
            //탑승인원
            let personnel = userData.personnel
            const buttons = await page.$$('.flex.justify-between.items-center.bg-gray-01.w-full.mt-4.px-1.py-2.rounded-md button');
            console.log(buttons);
            // 두 번째 버튼이 존재하는지 확인하고, 존재한다면 클릭
            if (buttons.length > 1) {
                for(w = 1 ; personnel > w ; w++){
                    console.log(personnel);
                    console.log(w);
                    await buttons[1].click(); // 배열은 0부터 시작하므로, 두 번째 요소는 인덱스 1을 가집니다.
                }
            }

            await page.waitForXPath("//li[contains(., '없음')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x("//li[contains(., '없음')]")
            if (elements.length > 0) {
                await elements[0].click(); // 첫 번째 요소 클릭
            }

            let otherText = userData.otherText
            const textarea = await page.$$('.request-memo-text');
            await textarea[0].type(otherText);

            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.waitForXPath("//button[contains(., '다음')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x("//button[contains(., '다음')]");
            if (elements.length > 0) {
                await elements[1].click(); // 첫 번째 요소 클릭
            }


            await new Promise(resolve => setTimeout(resolve, 1000));
            let vehicleType = userData.vehicleType

            await page.waitForXPath("//span[contains(., '선택')]"); // XPath를 만족하는 요소가 나타날 때까지 대기
            elements = await page.$x("//span[contains(., '선택')]");
            console.log(elements.length);
            if(vehicleType === "카니발"){
                await elements[0].click(); // 첫 번째 요소 클릭
            } else if(vehicleType === "스타리아 블랙") {
                await elements[1].click(); // 첫 번째 요소 클릭
            } else if(vehicleType === "휠체어카") {
                await elements[2].click(); // 첫 번째 요소 클릭
            } else if(vehicleType === "G90") {
                await elements[3].click(); // 첫 번째 요소 클릭
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            const reserveOK = await page.$$('.mdc-button__ripple');
            await reserveOK[6].click();

            await new Promise(resolve => setTimeout(resolve, 1000));
            

        }


        const responseApi = {
            message: 'Scraping successful',
            data: vacationData,
        };

        return responseApi;

    } catch (error) {
        console.log("실패" + error)
        return 'LOGIN_FAILED';
    }
}

module.exports = bizCreate;