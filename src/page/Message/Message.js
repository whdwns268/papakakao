import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import '../../styles/Message.css'
import { connect, useDispatch, useSelector } from 'react-redux';
import { setPrefaceValue, setTextareaValue, setCellData, setHandsontableConfig, setHandsontableData, setOverviewState, setFileValue } from '../../actions';
import { useCompareData } from '../../component/useCompareData';
import { useFormdataSave } from '../../component/useFormdataSave';
import Realtime from './Realtime.js';
import EzMsg from '../EzMsg.js';

function Message(props) {
    const dispatch = useDispatch();
    const handsontableData = useSelector(state => state.data);

    const hotElement = useRef(null);
    const [hot, setHot] = useState(null);
    const [isOverlayActive, setIsOverlayActive] = useState(false);
    const [isDataSendingList, setIsDataSendingList] = useState(false);
    const [formName, setFormName] = useState("폼 이름");
    const [options, setOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {

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

        const fetchData = async () => {
            try {
                const response = await axios.post('/formDataGet');
                setOptions(response.data); // 서버로부터 받은 데이터로 상태 업데이트
            } catch (error) {
                console.error('데이터를 가져오는 데 실패했습니다.', error);
            }
        };
        fetchData();
    }, []);

    function columnLabelToIndex(columnLabel) {
        let columnNumber = 0;
        for (let i = 0; i < columnLabel.length; i++) {
            columnNumber *= 26;
            columnNumber += columnLabel.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
        }
        return columnNumber - 1;
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
    function regexChange(value){
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
    const setformdataSave = useFormdataSave();

    function formdataSave() {
        setIsOverlayActive(true);
    }

    //새로운 폼 이름 입력 후 저장
    function handleChange(event) {
        setFormName(event.target.value); // 변경된 값을 상태에 업데이트
    };


    //텍스트필드 폼 저장
    function formdataSavego() {
        setformdataSave(formName); // 변경된 값을 상태에 업데이트
    };

    //텍스트필드 폼 선택
    function handleSelectChange(event) {
        const selectedFormName = event.target.value;

        // options에서 선택된 formname에 해당하는 객체를 찾습니다.
        const selectedItem = options.find(item => item.formname === selectedFormName);
        console.log(options);

        console.log(selectedItem);
        if (selectedItem) {
            // 찾은 객체의 prefaceValue와 textareaValue로 상태를 업데이트합니다.
            prefaceValueChange({ target: { value: selectedItem.prefaceValue } });
            handleTextareaChange({ target: { value: selectedItem.textareaValue } });
        }
    }

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
    const setcompareDataGo = useCompareData(selectedFiles); //데이터 실행

    //즉시발송 버튼을 눌렀을 때 
    const [showEzMsg, setShowEzMsg] = useState(false);
    const [msgText, setMsgText] = useState("");

    function handleButtonClick() {
                
        // 배열 내의 모든 값이 빈 문자열인지 확인
        const isAllEmpty = (data) => data.every(row => row.every(cell => cell === ''));
    
        if (handsontableData && !isAllEmpty(handsontableData)) {
            dispatch(setOverviewState());
            setIsDataSendingList(true);
            setcompareDataGo();
        } else {
            dispatch(setOverviewState());
            setMsgText("셀에 입력된 데이터가 없습니다.");
            setShowEzMsg(true);
            console.log(showEzMsg);
        }
    }
    

    return (
        <div className="main_div">
            {showEzMsg && <label className="isEzMsg"><EzMsg  MsgText={msgText} setShowEzMsg={setShowEzMsg} showEzMsg={showEzMsg} /></label>} {/* 조건부 렌더링 */}
            {isDataSendingList && <span className="SendingList"><Realtime isDataSendingList={isDataSendingList} setIsDataSendingList={setIsDataSendingList} /></span>}
            <div className="table_div_css" ref={hotElement} />
            <div className="settext">
                {/* 폼저장시 */}
                {isOverlayActive &&
                    <div className="settext_overlay">
                        <div>
                            <input type='text' value={formName} onChange={handleChange} />
                            <input type='button' value="저장" onClick={formdataSavego} />
                            <input type='button' value="닫기" onClick={() => setIsOverlayActive(false)} />
                        </div>
                    </div>
                }
                <ul className='textfield'>
                    <li>Textarea Fields</li>
                    <li>Active textarea</li>
                    <li>
                        <ul>
                            <li>보낼 단어가 특정되어 있는 열을 {"{열}"} 형태로 작성 ex ) {"{AA}"}</li>
                        </ul>
                    </li>
                    <li>Active textarea</li>
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
                            {options.map((option, index) => (
                                <option key={index} value={option.formname}>{option.formname}</option>
                            ))}
                        </select>
                            <button type='button' onClick={formdataSave}>폼 저장</button>
                            <button type='button'>개발 중</button>
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
                                <input type='text' maxLength={2} onChange={handleFileValue} value={props.fileValue} placeholder='AB'></input>
                            </span>
                        </span>
                    </li>
                </ul>

                <ul className='pickerfield'>
                    <li>
                        <div>
                            <input type="date"></input>
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
});

const mapDispatchToProps = {
    setPrefaceValue,
    setTextareaValue,
    setCellData,
    setHandsontableConfig,
    setHandsontableData,
    setFileValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);