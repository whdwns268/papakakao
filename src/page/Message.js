import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import './Message.css'
import { connect } from 'react-redux';
import { setPrefaceValue, setTextareaValue, setCellData, setHandsontableConfig, setHandsontableData } from '../actions';
import { useCompareData } from '../component/useCompareData';
import { useFormdataSave } from '../component/useFormdataSave';

function Message(props) {
    const hotElement = useRef(null);
    const [hot, setHot] = useState(null);
    const [isOverlayActive, setIsOverlayActive] = useState(false);
    const [formName, setFormName] = useState("폼 이름");
    const [options, setOptions] = useState([]);


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

    function handleTextareaChange(e) {
        const value = e.target.value;
        props.setTextareaValue(value);
        let output = value;
        let match;
        const regex = /\$([A-Z]+)\$/g;
        while ((match = regex.exec(value)) !== null) {
            const columnName = match[1];
            const columnIndex = columnLabelToIndex(columnName);
            const cellData = hot.getDataAtCell(0, columnIndex);
            const cellData2 = hot.getDataAtCol(columnIndex);
            output = output.replace(match[0], cellData);
        }
        props.setCellData(output);
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

    const setcompareData = useCompareData();

    function handleButtonClick() {
        setcompareData();
    };

    function prefaceValueChange(e) {
        props.setPrefaceValue(e.target.value);
    }

    function formdataSave() {
        setIsOverlayActive(true);

    }

    function handleChange(event) {
        setFormName(event.target.value); // 변경된 값을 상태에 업데이트
    };


    const setformdataSave = useFormdataSave();

    function formdataSavego() {
        setformdataSave(formName); // 변경된 값을 상태에 업데이트
    };

    function handleSelectChange(event) {
        const selectedFormName = event.target.value;

        // options에서 선택된 formname에 해당하는 객체를 찾습니다.
        const selectedItem = options.find(item => item.formname === selectedFormName);
        console.log(options);

        console.log(selectedItem);
        if (selectedItem) {
            // 찾은 객체의 prefaceValue와 textareaValue로 상태를 업데이트합니다.
            prefaceValueChange({ target: { value: selectedItem.prefaceValue } });
            handleTextareaChange({ target: { value: selectedItem.textareaValue} });
        }
    }

    return (
        <div className="main_div">

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
                            <li>보낼 단어가 특정되어 있는 열을 [ $열$  ] 형태로 작성</li>
                        </ul>
                    </li>
                    <li>Active textarea</li>
                    <li>
                        <input type='text' onChange={prefaceValueChange} value={props.prefaceValue} placeholder='머리말(시트데이터 적용불가)' />
                        <textarea onChange={handleTextareaChange} value={props.textareaValue} placeholder='본문' />
                    </li>
                    <li>Disabled textarea</li>
                    <li><div>{convertNewlineToBr(props.cellData)}</div></li>
                    <li>
                        <div>
                            <button type='button' onClick={formdataSave}>폼 저장</button>
                            <button type='button'>개발 중</button>
                        </div>
                    </li>
                </ul>

                <ul className='Selectfield'>
                    <li>Select input</li>
                    <li>
                        <div>Select form</div>
                        <select onChange={handleSelectChange}>
                            {options.map((option, index) => (
                                <option key={index} value={option.formname}>{option.formname}</option>
                            ))}
                        </select>
                    </li>

                    <li>
                        <div>발송그룹</div>
                        <select>
                            <option>시트 A열 데이터</option>
                        </select>
                    </li>
                </ul>

                <ul className='pickerfield'>
                    <li>Send Message</li>
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
});

const mapDispatchToProps = {
    setPrefaceValue,
    setTextareaValue,
    setCellData,
    setHandsontableConfig,
    setHandsontableData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);