import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import '../../styles/Message.css'
import { connect, useDispatch, useSelector } from 'react-redux';
import { setPrefaceValue, setTextareaValue, setCellData, setHandsontableConfig, setHandsontableData, setOverviewState, setFileValue, setNameColumnsValue, setFormValue} from '../../actions';
import { useCompareData } from '../../component/useCompareData';
import FormDataSave from './FormDataSave.js'
import Realtime from './Realtime.js';
import EzMsg from '../EzMsg.js';
import AskMsg from '../AskMsg.js';
import useFetchFormValue from '../../component/useFetchFormValue.js';
import { useFormdataDelete } from '../../component/useFormdataDelete.js';

function Message(props) {
    const dispatch = useDispatch();
    const handsontableData = useSelector(state => state.data);
    const formValue = useSelector(state => state.formValue);

    const hotElement = useRef(null);
    const [hot, setHot] = useState(null);
    const [isOverlayActive, setIsOverlayActive] = useState(false);
    const [isDataSendingList, setIsDataSendingList] = useState(false);

    const [formValues, setformValues] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const [isformSelectItem, setFormSelectItem] = useState([]);

    window.addEventListener('beforeunload', function (e) {
        // 새로고침이나 페이지 이동을 시도할 때 경고 메시지 표시
        e.preventDefault();
        e.returnValue = '';
    });
    const navigate = useNavigate();

    useFetchFormValue();

//세션체크
    useEffect(() => {
        axios.get('/teercheckUrl', {
            withCredentials: true, // 쿠키포함
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log(response);
            if (response.data === "no_userid" || response.data === "no_login" || response.data === "error_puppeteer") {
                localStorage.clear();
                alert("세선이 만료되었습니다. 다시 로그인해주세요")
                navigate('/login');
            }
        }).catch(error => {
            console.error('Error:', error);
        });



        props.setNameColumnsValue("A")

        const config = {
            data: props.data || Array.from({ length: 150 }, () => Array(50).fill('')), // data 수정
            rowHeaders: true, // 행 헤더를 표시합니다.
            colHeaders: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // 열 헤더를 설정합니다.
            width: '65%',
            height: '100%',
            overflow: 'scroll',
            licenseKey: 'non-commercial-and-evaluation',
            afterChange: (changes, source) => {
                if (source !== 'loadData') {
                    props.setHandsontableData(config.data);
                }
            },
        };
        props.setHandsontableConfig(config);
        const hotInstance = new Handsontable(hotElement.current, config);
        setHot(hotInstance);
    }, []);

    function columnLabelToIndex(columnLabel) {
        let columnNumber = 0;
        for (let i = 0; i < columnLabel.length; i++) {
            columnNumber *= 26;
            columnNumber += columnLabel.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
        }
        return columnNumber - 1;
    }

    //크루명 명 입력열
    function handlenameColumnsValue(e) {
        let value = e.target.value
        value = value.toUpperCase();
        props.setNameColumnsValue(value)
    }

    //머리말 입력 시 
    function prefaceValueChange(e) {
        const value = e.target.value;
        props.setPrefaceValue(value);
    }

    //textarea 입력 시
    function handleTextareaChange(e) {
        const value = e.target.value;
        props.setTextareaValue(value);
        let TextAreaOutput = regexChange(value);
        props.setCellData(TextAreaOutput);
    }

    // 시트데이터 확인 후 리턴
    function regexChange(value) {
        let output = value;
        let match;
        const regex = /\{([A-Za-z]+)\}/gi;
        while ((match = regex.exec(value)) !== null) {
            const columnName = match[1].toUpperCase();
            const columnIndex = columnLabelToIndex(columnName);
            const cellData = hot.getDataAtCell(0, columnIndex);
            output = output.replace(match[0], cellData);
        }
        return output;
    }

    function convertNewlineToBr(text) {
        return text.split('\n').map((line, index) => {
            return (
                <span key={index}>
                    {line}
                    <br />
                </span>
            );
        });
    }

    //폼 저장 컴포넌트 실행
    function handleformdataSave() {
        setIsOverlayActive(true);
    }


    const setFormdataDeleteGo = useFormdataDelete({ formSelectItem: isformSelectItem }); // 폼삭제 실행
    //폼 삭제 컴포넌트 실행
    function handleformdataDelete() {
        if (isformName !== "폼 선택") {
            dispatch(setOverviewState());
            setTitleMsgText("폼 삭제")
            setMsgText(isformName+" 폼을 삭제할까요?");
            setShowAskMsg(true);
        } else {
            dispatch(setOverviewState());
            setTitleMsgText("!")
            setMsgText("선택된 폼이 없습니다");
            setShowEzMsg(true);
        }
    }



    const [isformName, setFormName] = useState("폼 선택");

    useEffect(()=>{
        props.setFormValue(formValue);
    },[formValue])


    
    //텍스트필드 폼 선택
    function handleSelectChange(event) {
        const selectedFormName = event.target.value;
        setFormName(selectedFormName);
        // formValue 선택된 formname에 해당하는 객체를 찾습니다.
        const selectedItem = formValue.find(item => item.formname === selectedFormName);
        setFormSelectItem(selectedItem);
        if (selectedItem) {
            // 찾은 객체의 prefaceValue와 textareaValue로 상태를 업데이트합니다.
            prefaceValueChange({ target: { value: selectedItem.prefaceValue } });
            handleTextareaChange({ target: { value: selectedItem.textareaValue } });
            return selectedFormName;
        }
    }
    // 텍스트필드 받은 값 확인
    function handleUserChoice(choice) {
        console.log(choice); // "YES" 또는 "NO"
    };

    useEffect(() => {
        setFormName(isformName);
    }, [isformName])

    //파일명 입력열
    function handleFileValue(e) {
        let value = e.target.value
        value = value.toUpperCase();
        props.setFileValue(value)
    }

    //히든 파일선택버튼 
    function handleFileButton() {
        fileInputRef.current.click(); // ref를 통해 input 요소 클릭
    };

    //파일 데이터 확인 
    function handleFileChange(event) {
        const files = event.target.files;
        setSelectedFiles(files)
    };

    // ------------------전송관련
    const setcompareDataGo = useCompareData({ selectedFiles: selectedFiles }); //데이터 실행

    const [showEzMsg, setShowEzMsg] = useState(false);
    const [showAskMsg, setShowAskMsg] = useState(false);
    const [msgText, setMsgText] = useState("");
    const [titleMsgText, setTitleMsgText] = useState("");

    //즉시발송 버튼을 눌렀을 때 
    function handleButtonClick() {

        // 배열 내의 모든 값이 빈 문자열인지 확인
        const isAllEmpty = (data) => data.every(row => row.every(cell => cell === '' || cell === null));

        if (handsontableData && !isAllEmpty(handsontableData)) {

            //크루명 열의 배열에 데이터가 있는지 확인
            console.log(props.namecolumnsValue)
            const nameValueIndex = columnLabelToIndex(props.namecolumnsValue)
            const countNonEmptyFirstCells = (data) => {
                const nonEmptyFirstCells = data.filter(row => row[nameValueIndex] !== '' && row[nameValueIndex] !== null);
                return nonEmptyFirstCells.length;
            };
            const nonEmptyFirstCellCount = countNonEmptyFirstCells(handsontableData);
            console.log(nonEmptyFirstCellCount)
            if (nonEmptyFirstCellCount === 0) {
                dispatch(setOverviewState());
                setMsgText(props.namecolumnsValue + "열에 입력된 크루명이 없습니다.");
                setShowEzMsg(true);
            } else {
                dispatch(setOverviewState());
                setIsDataSendingList(true);
                setcompareDataGo();
                console.log(handsontableData);
            }

        } else {
            dispatch(setOverviewState());
            setMsgText("셀에 입력된 데이터가 없습니다.");
            setShowEzMsg(true);
            console.log(handsontableData);
        }
    }


    return (
        <div className="main_div">
            {showEzMsg && <label className="isEzMsg"><EzMsg MsgText={msgText} setShowEzMsg={setShowEzMsg} showEzMsg={showEzMsg} /></label>}
            {showAskMsg && <span className="isEzMsg"><AskMsg MsgText={msgText} TitleMsgText={titleMsgText} setShowAskMsg={setShowAskMsg} showAskMsg={showAskMsg} onUserChoice={handleUserChoice} executeOnYes={setFormdataDeleteGo}/></span>}
            {isDataSendingList && <span className="SendingList"><Realtime isDataSendingList={isDataSendingList} setIsDataSendingList={setIsDataSendingList} selectedFiles={selectedFiles} /></span>}
            <div className="table_div_css" ref={hotElement} />
            <div className="settext">
                {/* 폼저장시 */}
                {isOverlayActive &&
                    <div className="settext_overlay">
                        <FormDataSave setIsOverlayActive={setIsOverlayActive} />
                    </div>
                }
                <ul className='textfield'>
                    <li>Textarea Fields</li>
                    <li>How to use</li>
                    <li>
                        <ul>
                            <li>보낼 단어가 특정되어 있는 열을 {"{열}"} 형태로 작성 ex ) {"{AA}"}</li>
                        </ul>
                    </li>
                    <li className='nameSelectinput'>
                        <span>Active textarea</span>
                        <span>
                            <div>크루명 열</div>
                            <input type='text' maxLength={2} onChange={handlenameColumnsValue} value={props.namecolumnsValue} placeholder='AB'></input>
                        </span>
                    </li>
                    <li>
                        <input type='text' onChange={prefaceValueChange} value={props.prefaceValue} placeholder='머리말(시트데이터 적용불가)' />
                        <textarea onChange={handleTextareaChange} value={props.textareaValue} placeholder='본문' />
                    </li>
                    <li>Disabled textarea</li>
                    <li><div>{convertNewlineToBr(props.cellData)}</div></li>
                </ul>

                <ul className='Selectfield'>
                    <li>Select input</li>
                    <li className='Selectfield_selectbox'>
                        <div>Select form</div>
                        <span><select onChange={handleSelectChange}>
                            <option value="폼 선택" hidden>폼 선택</option>
                            {formValue.map((option, index) => (
                                <option key={index} value={option.formname}>{option.formname}</option>
                            ))}
                        </select>
                            <button type='button' onClick={handleformdataSave}>폼 저장</button>
                            <button type='button' onClick={handleformdataDelete}>폼 삭제</button>
                        </span>
                    </li>

                    <li>
                        <div><span>Attach file</span></div>
                        <span className='Selectfield_fileupload'>
                            <span>
                                <input type="file" ref={fileInputRef} hidden="hidden" onChange={handleFileChange} multiple />
                                <button type="button" onClick={handleFileButton}>파일 선택</button>
                                {selectedFiles.length > 0 ? <span>{selectedFiles.length}개의 파일 선택됨</span> : <span>선택된 파일 없음</span>}
                            </span>
                            <span>
                                <div>파일명 열</div>
                                <input type='text' maxLength={2} onChange={handleFileValue} value={props.fileValue} placeholder='ex) AB'></input>
                            </span>
                        </span>
                    </li>
                </ul>

                <ul className='pickerfield'>
                    <li>
                        <div>
                        <input type="date"></input>
                        <input type="time"></input>
                        </div>
                        <div>
                            <button type='button'>예약 발송</button>
                            <button onClick={handleButtonClick} type='button'>즉시 발송</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    prefaceValue: state.prefaceValue,
    textareaValue: state.textareaValue,
    cellData: state.cellData,
    handsontableConfig: state.config,
    data: state.data,
    setIsSendding: state.Value,
    fileValue: state.fileValue,
    namecolumnsValue: state.namecolumnsValue,
    formValue: state.formValue,
});

const mapDispatchToProps = {
    setPrefaceValue,
    setTextareaValue,
    setCellData,
    setHandsontableConfig,
    setHandsontableData,
    setFileValue,
    setNameColumnsValue,
    setFormValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);