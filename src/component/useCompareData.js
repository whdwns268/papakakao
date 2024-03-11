// useCompareData.js
import { useSelector } from 'react-redux';
import axios from 'axios';
const crewData = require('../crew.json');  // crew.json 파일 불러오기

export function useCompareData() {
  const handsontableData = useSelector(state => state.data);
  const textareaValue = useSelector(state => state.textareaValue);


  return async () => {

    let resData;
    if (handsontableData) {

      for (const w of handsontableData) {
        if (w[0]) { // a열의 데이터가 있을때만

          try { //크루명으로 db에서 데이터 뽑아내기
            const response = await axios.post('/crewdatafind', {
              crewname: w[0],
            });

            console.log('Response:', response.data);
            resData = response.data;
            await new Promise(resolve => setTimeout(resolve, 1000)); // 2.5초 동안 대기

          } catch (error) {
            console.error('Error:', error);
          }

          let kakaolink = resData[0]["kakaolink"]

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
              output: output
            });

            console.log('Response:', response.data);

            await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5초 동안 대기

          } catch (error) {
            console.error('Error:', error);
          }
        }
      }
    } else {
      console.log('No match found');
    }
  }
}

const columnLabelToIndex = (columnLabel) => {
  let columnNumber = 0;
  for (let i = 0; i < columnLabel.length; i++) {
    columnNumber *= 26;
    columnNumber += columnLabel.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
  }
  return columnNumber - 1;
}
