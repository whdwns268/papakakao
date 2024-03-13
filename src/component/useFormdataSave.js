// useFormdataSave.js
import { useSelector } from 'react-redux';
import axios from 'axios';

export function useFormdataSave() {

    const textareaValue = useSelector(state => state.textareaValue);
    const prefaceValue = useSelector(state => state.prefaceValue);
    
    return async (formname) => {
        console.log(formname)
        let resData;

            if (textareaValue) { // a열의 데이터가 있을때만

                try { //크루명으로 db에서 데이터 뽑아내기
                    const response = await axios.post('/formDataSave', {
                        formname: formname,
                        textareaValue: textareaValue,
                        prefaceValue: prefaceValue,
                    });

                    console.log('Response :', response.data);
                    resData = response.data;

                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                console.log("No textareaValue")
                return "No textareaValue"
            }
        }
    }
