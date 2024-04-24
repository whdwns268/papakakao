// useCompareData.js
import { useSelector, useDispatch } from 'react-redux';
import { setCompareData } from '../actions'; 
import axios from 'axios';

export function useCompareData({selectedFiles, crewinfoAdd_Count}) {
  
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
    let resetCount = 0;
    let successfulCount = 0;
    let failCount = 0;

// 각 행의 첫 번째 열을 확인하여 빈 문자열이 아닌 값만 필터링
    const countNonEmptyFirstCells = (data) => {
      const nonEmptyFirstCells = data.filter(row => row[namecolumns] !== '' && row[namecolumns] !== null);
      return nonEmptyFirstCells.length;
    };

    const nonEmptyFirstCellCount = countNonEmptyFirstCells(handsontableData);
    console.log(crewinfoAdd_Count);

    let startIndex = 0;
    let endIndex = handsontableData.length - 1;

    if(crewinfoAdd_Count){
      startIndex = crewinfoAdd_Count-1;
      endIndex = crewinfoAdd_Count-1;
    }
    console.log(startIndex);
    console.log(endIndex);
    for (let i = startIndex; i <= endIndex; i++) {
      let w = handsontableData[i];
      if (w[namecolumns]) { // 크루명열의 데이터가 있을때만
        let cleanedData = w[namecolumns].replace(/\s+/g, '');
        let results = {};

        try { //크루명으로 db에서 데이터 뽑아내기
          const response = await axios.post('/crewdatafind', {
            crewname: cleanedData,
          });

          resData = response.data;
          results['CrewnameCk'] = resData
          console.log(results);
          await new Promise(resolve => setTimeout(resolve, 500)); // 1초 동안 대기

        } catch (error) {
          
          results['DBerror:'] = error;
          console.error('Error:', error);
        }


        if (resData.length === 0 || resData === "undefined") {
          results['CrewnameCk'] = {};
          results['CrewnameCk'][0] = {};
          results['CrewnameCk'][0]["crewname"] = cleanedData;
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

          if (fileValue && selectedFiles && selectedFiles.length > 0 || fileValue !== "") {
            const fileNamecolumnIndex = columnLabelToIndex(fileValue);
            console.log(fileNamecolumnIndex)
            console.log(selectedFiles)
            let inputfileName = w[fileNamecolumnIndex].normalize('NFC')
            const filesArray = Array.from(selectedFiles);
            const matchedFile = filesArray.find(file => file.name.normalize('NFC') === inputfileName);
        
            console.log(filesArray[0].name);
            console.log(inputfileName)

            // 찾은 파일 처리
            if (matchedFile) {
              console.log(matchedFile.name.normalize('NFC'));
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
            await new Promise(resolve => setTimeout(resolve, 500));
            successfulCount++;
          } catch (error) {
            results['MsgResponse'] = error;
            console.error('Error:', error);
          }
        }
        count++;
        
        if(crewinfoAdd_Count){
          results['resetCount'] = 1;
          results['Count'] = crewinfoAdd_Count;;
        }else{
          results['resetCount'] = resetCount;
          results['Count'] = count;
          resetCount++;
          console.log(resetCount);
        }
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