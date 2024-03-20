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

console.log(fileValue)
  return async () => {

    if (!handsontableData) {
      dispatch(setCompareData('셀에 입력된 데이터가 없습니다.'))
      return '셀에 입력된 데이터가 없습니다.';
    }

    let resData;
    let count = 0;
    for (const w of handsontableData) {
      if (w[0]) { // a열의 데이터가 있을때만
        let results = {};
        results['crewname'] = w[0];
        try { //크루명으로 db에서 데이터 뽑아내기
          const response = await axios.post('/crewdatafind', {
            crewname: w[0],
          });

          resData = response.data;
          results['CrewnameCk'] = resData
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 동안 대기

        } catch (error) {

          results['DBerror:'] = error;
          console.error('Error:', error);
        }


        if (resData.length === 0 || resData=="undefined") {
          results['DB_data_state'] = 'data_None';
        } else {

          let kakaolink = resData[0]['kakaolink']
          let matchtext;

          const value = textareaValue;
          let output = value;
          const regex = /\{([A-Z]+)\}/gi;
          while ((matchtext = regex.exec(value)) !== null) {
            console.log(w[0])
            const columnName = matchtext[1].toUpperCase();
            const columnIndex = columnLabelToIndex(columnName);
            const celldata = w[columnIndex]
            output = output.replace(matchtext[0], celldata);
          }

          const formData = new FormData();

          formData.append('kakaolink', kakaolink);
          formData.append('output', output);
          formData.append('prefaceValue', prefaceValue);

          if (selectedFiles.length > 0 || fileValue !== "") {
            const fileNamecolumnIndex = columnLabelToIndex(fileValue);
            console.log(fileNamecolumnIndex)
            console.log(selectedFiles)
            const filesArray = Array.from(selectedFiles);
            const matchedFile = filesArray.find(file => file.name === w[fileNamecolumnIndex]);

            // 찾은 파일 처리
            if (matchedFile) {
              console.log("찾은 파일:", matchedFile);
              // 일치하는 파일을 formData에 추가합니다.
              formData.append('filesName', matchedFile.name);
              formData.append('files', matchedFile);
              // 필요한 추가 처리를 여기서 수행합니다.
            } else {
              console.log("해당 이름을 가진 파일이 없습니다.");
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
            await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5초 동안 대기

          } catch (error) {
            results['Msgerror'] = error;
            console.error('Error:', error);
          }
        }
        count++;
        results['Count'] = count;
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