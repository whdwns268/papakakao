import React, { useEffect, useRef, useState } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import './Message.css'
import { connect } from 'react-redux';
import { setPrefaceValue, setTextareaValue, setCellData, setHandsontableConfig, setHandsontableData } from '../actions';
import { useCompareData  } from '../component/useCompareData';

function Message(props) {
    const hotElement = useRef(null);
    const [hot, setHot] = useState(null);

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
    }, []);



    const columnLabelToIndex = (columnLabel) => {
        let columnNumber = 0;
        for (let i = 0; i < columnLabel.length; i++) {
            columnNumber *= 26;
            columnNumber += columnLabel.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
        }
        return columnNumber - 1;
    }

    function handleTextareaChange(e){
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
            console.log(cellData2)
            output = output.replace(match[0], cellData);
        }
        props.setCellData(output);
    }

    function convertNewlineToBr(text){
        return text.split('\n').map((line, index) => {
            return (
                <span key={index}>
                    {line}
                    <br />
                </span>
            );
        });
    }

    const compareData = useCompareData();

    function handleButtonClick(){
      compareData();
    };

    function prefaceValueChange(e){
        props.setPrefaceValue(e.target.value);
    }

    return (
        <div className="main_div">
            <div className="table_div_css" ref={hotElement} />
            <div className="settext">
                <ul className='textfield'>
                    <li>Textarea Fields</li>
                    <li>Active textarea</li>
                    <li>
                        <ul>
                            <li>보낼 단어가 특정되어 있는 열을 [ $열$  ] 형태로 작성</li>
                            <li>A열이 크루의 이름이 들어가 있는 경우 그룹을 시트데이터로 선택 후 발송</li>
                            <li>발송이 완료된 경우 해당 열은 초록색으로 표기 / 실패는 빨강</li>
                        </ul>
                    </li>
                    <li>Active textarea</li>
                    <li>
                        <input type='text' onChange={prefaceValueChange} value={props.prefaceValue}/>
                        <textarea onChange={handleTextareaChange} value={props.textareaValue} />
                    </li>
                    <li>Disabled textarea</li>
                    <li><div>{convertNewlineToBr(props.cellData)}</div></li>
                </ul>

                <ul className='Selectfield'>
                    <li>Select input</li>
                    <li>Select Country</li>
                    <li>
                        <select>
                            <option>시트데이터</option>
                            <option>1조</option>
                            <option>2조</option>
                            <option>3조</option>
                            <option>4조</option>
                            <option>5조</option>
                        </select>
                        <select>
                            <option>발송그룹</option>
                            <option>1조</option>
                            <option>2조</option>
                            <option>3조</option>
                            <option>4조</option>
                            <option>5조</option>
                        </select>
                    </li>
                    <li>현재 설정된 그룹</li>
                    <li>
                        <button>그룹삭제</button>
                    </li>
                </ul>

                <ul className='pickerfield'>
                    <li>메시지 발송</li>
                    <li>
                        <input type="date"></input>
                        <button type='button'>예약 발송</button>
                        <button onClick={handleButtonClick} type='button'>즉시 발송</button>
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