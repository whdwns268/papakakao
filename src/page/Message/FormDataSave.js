import React, { useEffect, useRef, useState } from 'react';
import { useFormdataSave } from '../../component/useFormdataSave';
import '../../styles/FormDataSave.css'
import { useSelector, useDispatch } from 'react-redux';
import EzMsg from '../EzMsg.js';


function FormDataSave({ setIsOverlayActive }) {

    const textareaValue = useSelector(state => state.textareaValue);
    const prefaceValue = useSelector(state => state.prefaceValue);
    const namecolumnsValue = useSelector(state => state.namecolumnsValue);
    const formValue = useSelector(state => state.formValue);

    const [formName, setFormName] = useState("");
    const [isnamecolumnsValue, setNameColumnsValue] = useState(namecolumnsValue);
    const [isprefaceValue, setPreFaceValue] = useState(prefaceValue);
    const [istextareaValue, setTextAreaValue] = useState(textareaValue);

    const [scale, setScale] = useState('scale(0.0)');
    const hasAnimated = useRef(false); // 애니메이션이 실행되었는지 확인하기 위한 ref

    //내용 알림 박스
    const [showEzMsg, setShowEzMsg] = useState(false);
    const [msgText, setMsgText] = useState("");

    useEffect(() => {
        if (!hasAnimated.current) {
            setScale('scale(1.0)'); // 컴포넌트가 마운트되면 scale을 1.0으로 변경
            hasAnimated.current = true; // 애니메이션이 실행되었다고 표시
        }
    }, []);

    useEffect(() => {
        if (msgText === "정상적으로 저장되었습니다.") {
            if (showEzMsg === false) {
                console.log(msgText)
                setIsOverlayActive(false);
            }
        }
    }, [showEzMsg]);




    //새로운 폼 이름 입력 후 저장
    function handleformNameChange(event) {
        setFormName(event.target.value); // 변경된 값을 상태에 업데이트
    };

    function handleNameColumnsChange(event) {
        setNameColumnsValue(event.target.value);
    }

    function handlePreFaceChange(event) {
        setPreFaceValue(event.target.value);
    }

    function handleTextAreaChange(event) {
        setTextAreaValue(event.target.value);
    }


    //텍스트필드 폼 저장
    const setformdataSave = useFormdataSave();

    async function formdataSavego() {

        let formdata = [{
            formName: formName,
            namecolumns: isnamecolumnsValue,
            preface: isprefaceValue,
            textarea: istextareaValue,
        }];

        console.log(formName)
        if (formName === "") {
            setMsgText("폼 이름을 입력해주세요");
            setShowEzMsg(true);
        } else if (isnamecolumnsValue === "") {
            setMsgText("크루명 열을 입력해주세요");
            setShowEzMsg(true);
        } else if (istextareaValue === "") {
            setMsgText("본문을 입력해주세요");
            setShowEzMsg(true);
        } else {
            console.log("test")
            try {
                let formApiresult = await setformdataSave(formdata);
                console.log(formApiresult);

                if (formApiresult["situation"] === "successful") {
                    setMsgText("정상적으로 저장되었습니다.");
                    setShowEzMsg(true);

                } else {
                    setMsgText("문제가 발생했습니다." + formApiresult);
                    setShowEzMsg(true);
                }

            } catch (error) {
                setMsgText("문제가 발생했습니다." + error);
                setShowEzMsg(true);
            }
        }

    };



    function handleTransitionEnd() {
        if (scale === 'scale(0)') {
            setIsOverlayActive(false);
        }
    }

    //닫기 버튼눌럿을때
    function formdataSaveclose() {
        setScale('scale(0)');
    }




    return (
        <div className='FormDataSave' style={{ transform: scale }} onTransitionEnd={handleTransitionEnd}>
            {showEzMsg && <label className="isEzMsg"><EzMsg MsgText={msgText} setShowEzMsg={setShowEzMsg} showEzMsg={showEzMsg} /></label>} {/* 조건부 렌더링 */}
            <div className='FormDataSave_div'>
                <ul>
                    <li>텍스트필드 폼 저장</li>
                    <li>텍스트 필드의 현재 데이터를 불러옵니다.</li>
                    <li>
                        <label>
                            <span>폼 이름(필수)</span>
                            <input type='text' placeholder={formName} onChange={handleformNameChange} />
                        </label>
                        <label>
                            <span>크루명 열(필수)</span>
                            <input type='text' value={isnamecolumnsValue} onChange={handleNameColumnsChange} />
                        </label>
                    </li>
                    <li><input type='text' value={isprefaceValue} onChange={handlePreFaceChange} /></li>
                    <li><textarea value={istextareaValue} onChange={handleTextAreaChange}></textarea></li>
                    <li>
                        <input type='button' value="닫기" onClick={formdataSaveclose} />
                        <input type='button' value="저장" onClick={formdataSavego} />
                    </li>
                </ul>


            </div>
        </div>
    )
}
export default FormDataSave;