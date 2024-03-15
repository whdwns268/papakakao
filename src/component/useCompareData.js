// useCompareData.js
import { useSelector, useDispatch } from 'react-redux';
import { setCompareData } from '../actions'; // 이 줄을 추가하세요
import axios from 'axios';


export function useCompareData() {
  const dispatch = useDispatch();
  const handsontableData = useSelector(state => state.data);
  const textareaValue = useSelector(state => state.textareaValue);
  const prefaceValue = useSelector(state => state.prefaceValue);

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
          await new Promise(resolve => setTimeout(resolve, 1000)); // 2.5초 동안 대기

        } catch (error) {
          
          results['DBerror:'] = error;
          console.error('Error:', error);
        }


        if (resData.length === 0) {
          results['DB_data_state'] = 'data_None';
        } else {

          let kakaolink = resData[0]['kakaolink']
          let matchtext;

          const value = textareaValue;
          let output = value;
          const regex = /\$([A-Z]+)\$/g;
          while ((matchtext = regex.exec(value)) !== null) {
            console.log(w[0])
            const columnName = matchtext[1];
            const columnIndex = columnLabelToIndex(columnName);
            const celldata = w[columnIndex]
            output = output.replace(matchtext[0], celldata);
          }

          console.log(output)

          try {
            const response = await axios.post('/kakaomsg', {
              kakaolink: kakaolink,
              output: output,
              prefaceValue: prefaceValue,
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
