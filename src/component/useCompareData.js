// useCompareData.js
import { useSelector, useDispatch } from 'react-redux';
import { setCompareData } from '../actions'; // 이 줄을 추가하세요
import axios from 'axios';


export function useCompareData(selectedFiles) {
  
  const dispatch = useDispatch();
  const handsontableData = useSelector(state => state.data);
  const textareaValue = useSelector(state => state.textareaValue);
  const prefaceValue = useSelector(state => state.prefaceValue);
  const fileValue = useSelector(state => state.fileValue);
  const namecolumnsValue = useSelector(state => state.namecolumnsValue);

  dispatch(setCompareData());

  return async () => {

    const namecolumns = columnLabelToIndex(namecolumnsValue);

    let resData;
    let count = 0;
    let successfulCount = 0;
    let failCount = 0;

// 각 행의 첫 번째 열을 확인하여 빈 문자열이 아닌 값만 필터링
    const countNonEmptyFirstCells = (data) => {
      const nonEmptyFirstCells = data.filter(row => row[namecolumns] !== '' && row[namecolumns] !== null);
      return nonEmptyFirstCells.length;
    };

    const nonEmptyFirstCellCount = countNonEmptyFirstCells(handsontableData);

    for (const w of handsontableData) {
      if (w[namecolumns]) { // a열의 데이터가 있을때만
        let results = {};

        try { //크루명으로 db에서 데이터 뽑아내기
          const response = await axios.post('/crewdatafind', {
            crewname: w[namecolumns],
          });

          resData = response.data;
          results['CrewnameCk'] = resData
          console.log(results);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 동안 대기

        } catch (error) {
          
          results['DBerror:'] = error;
          console.error('Error:', error);
        }


        if (resData.length === 0 || resData === "undefined") {
          results['CrewnameCk'] = {};
          results['CrewnameCk'][0] = {};
          results['CrewnameCk'][0]["crewname"] = w[namecolumns];
          results['MsgResponse'] = {};
          results['MsgResponse']['message'] = "NotCrewfind";
          failCount++;
        } else {
          let kakaolink = resData[0]['kakaolink']
          let matchtext;

          const value = textareaValue;
          let output = value;
          const regex = /\{([A-Z]+)\}/gi;
          while ((matchtext = regex.exec(value)) !== null) {
            const columnName = matchtext[1].toUpperCase();
            const columnIndex = columnLabelToIndex(columnName);
            const celldata = w[columnIndex]
            output = output.replace(matchtext[0], celldata);
          }
          results['Msg'] = output;

          const formData = new FormData();

          formData.append('kakaolink', kakaolink);
          formData.append('output', output);
          formData.append('prefaceValue', prefaceValue);

          if (selectedFiles.length > 0 || fileValue !== "") {
            const fileNamecolumnIndex = columnLabelToIndex(fileValue);
            console.log(fileNamecolumnIndex)
            console.log(selectedFiles)
            const filesArray = Array.from(selectedFiles);
            const matchedFile = filesArray.find(file => file.name.normalize('NFC') === w[fileNamecolumnIndex]);
            console.log(w[fileNamecolumnIndex]);

            // 찾은 파일 처리
            if (matchedFile) {
              console.log("찾은 파일:", matchedFile);
              // 일치하는 파일을 formData에 추가합니다.
              formData.append('filesName', matchedFile.name);
              formData.append('files', matchedFile);
            }
          }

          try {
            const response = await axios.post('/kakaomsg', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            //console.log('Response:', response.data);
            results['MsgResponse'] = response.data;
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 동안 대기
            successfulCount++;
          } catch (error) {
            results['MsgResponse'] = error;
            console.error('Error:', error);
          }
        }
        count++;
        results['Count'] = count;
        results['successfulCount'] = successfulCount;
        results['failCount'] = failCount;
        results['TotalCount'] = nonEmptyFirstCellCount;
        console.log(results);
        dispatch(setCompareData(results));
      }
    }
  }
}

function columnLabelToIndex(columnLabel) {
  let columnNumber = 0;
  for (let i = 0; i < columnLabel.length; i++) {
    columnNumber *= 26;
    columnNumber += columnLabel.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
  }
  return columnNumber - 1;
}