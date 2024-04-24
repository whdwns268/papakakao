//import React, { useEffect, useRef, useState } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCompareData } from '../../component/useCompareData';
import Featured from '../../ico/Featured.svg';
import Close from '../../ico/close.svg';
import '../../styles/CrewinmfoAdd.css'

function CrewinfoAdd({ crewname, selectcount, setCrewInfoAdd, isCrewinfoAdd , selectedFiles }) {

    const [crewnameValue, setCrewnName] = useState(crewname);
    const [scale, setScale] = useState('scale(0.0)');
    const hasAnimated = useRef(false); // 애니메이션이 실행되었는지 확인하기 위한 ref

    useEffect(() => {
        if (!hasAnimated.current) {
            setScale('scale(1.0)'); // 컴포넌트가 마운트되면 scale을 1.0으로 변경
            hasAnimated.current = true; // 애니메이션이 실행되었다고 표시
        }
    }, []);

    const setcompareDataGo = useCompareData({ selectedFiles: selectedFiles, crewinfoAdd_Count: selectcount });

    function handleCrewname(e) {
        let value = e.target.value;
        setCrewnName(value);
    }

    const [crewcode, setCrewCode] = useState('');
    const [crewemail, setCrewEmail] = useState('');
    const [crewphone, setCrewPhone] = useState('');
    const [crewkakao, setCrewKakao] = useState('');
    const [isinputInvaild, setInputInvaild] = useState(true);

    function handleCrewCode(event) {
        const value = event.target.value;
        // 숫자만 포함되어 있는지 확인하고, 최대 4자리만 입력받기
        const numbers = value.slice(0, 4);
        setCrewCode(numbers);
    };

    //크루 이메일 입력 핸들링
    function handleCrewEmail(event) {
        const email = event.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
            setCrewEmail(email);

        } else {

        }
    }

    //크루 휴대폰번호 핸들링
    function handleCrewphone(event) {
        const phone = event.target.value;
        const setphone = event.target.value;
        const phoneRegex = /^10\d{8,9}$/;

        if (phoneRegex.test(phone)) {
            // 휴대폰 번호 형식이 올바른 경우

            const phonenumbers = phone.slice(0, 11);
            console.log("올바른 휴대폰 번호 형식입니다.");
            setCrewPhone(phonenumbers);
            setInputInvaild(true);
        } else {
            console.log("번호확인 ㄱ입니다.");
            setCrewPhone(setphone);
            setInputInvaild(false);
        }
    }

    function handleCrewKakao(event) {
        const value = event.target.value;
        setCrewKakao(value);
    }

    //창닫기버튼 클릭 핸들러1
    function handleTransitionEnd() {
        if (scale === 'scale(0)') {
            setCrewInfoAdd(false);
        }
    }

    // 닫기 버튼 클릭 핸들러2
    function handleCrewinfo_close() {
        setScale('scale(0)'); // 역방향 트랜지션 적용    
    }

    //저장 후 발송버튼 핸들링
    async function handdleCrewDataInsert(e) { 
        console.log(selectcount);
        try {
            // 크루명으로 db에서 데이터 뽑아내기
            const response = await axios.post('/crewDataAdd', {
                crewname: crewname,
                crewno: crewcode,
                crewmail: crewemail,
                crewtell: crewphone,
                state: 'Active',
                kakaolink: crewkakao,
            });
            let result = response.data
            if(result.message === "Data added successfully"){
                if(e === "close"){
                    console.log("close" + e)
                    handleCrewinfo_close()
                }else if(e === "send_close"){
                    console.log("send_close" + e)
                    // ------------------전송관련
                    setcompareDataGo();
                    handleCrewinfo_close()
                }
            }else{
                alert("에러발생 관리자에게 문의해주세요 : " + result.message)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    return (
        <div className='crewinfoAdd' style={{ transform: scale }} onTransitionEnd={handleTransitionEnd}>
            <span>
                <div><img src={Featured} /></div>
                <div>크루정보 입력</div>
                <div>카카오톡 채널링크는 정확하게 입력해주세요</div>
                <label onClick={handleCrewinfo_close}><img src={Close} /></label>
            </span>
            <span>
                <div>
                    <label>크루명(필수)</label>
                    <input type="text" onChange={handleCrewname} value={crewnameValue} />
                </div>
                <div>
                    <label>크루코드(필수)</label>
                    <input type="number" onChange={handleCrewCode} value={crewcode} placeholder="ex) 1234" />
                </div>
            </span>

            <span>
                <div>
                    <label>이메일</label>
                    <input type="text" onChange={handleCrewEmail} value={crewemail} />
                </div>
                <div>
                    <label>휴대폰</label>
                    <input type="number" onChange={handleCrewphone} value={crewphone} className={isinputInvaild ? '' : 'crewinfo_inputInvaild'} placeholder="ex) 1012345678" />
                </div>
            </span>

            <span>
                <label>카카오톡채널 링크(필수)</label>
                <input type="text" onChange={handleCrewKakao} value={crewkakao} placeholder="ex) https://center-pf.kakao.com/_xmnHyb/chats/4856752757799108" />
            </span>
            <span>
                <button type="button" onClick={() => handdleCrewDataInsert("send_close")}>저장 후 발송</button>
                <button type="button" onClick={() => handdleCrewDataInsert("send")}>저장 후 닫기</button>
            </span>
        </div>
    )
}
export default CrewinfoAdd;