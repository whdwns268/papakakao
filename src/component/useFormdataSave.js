// useFormdataSave.js
import { useSelector } from 'react-redux';
import axios from 'axios';
import useFetchFormValue from './useFetchFormValue.js';

export function useFormdataSave() {
    const { refreshFormData } = useFetchFormValue();
    const textareaValue = useSelector(state => state.textareaValue);
    const prefaceValue = useSelector(state => state.prefaceValue);
    
    return async (formdata) => {
        console.log(formdata[0].formName)
        console.log(formdata[0].namecolumns)
        console.log(formdata[0].preface)
        console.log(formdata[0].textarea)
        let resData;

            if (formdata) { // formdata만 있을 때

                try { 
                    const response = await axios.post('/formDataSave', {
                        formname: formdata[0].formName,
                        namecolumns:formdata[0].namecolumns,
                        textareaValue: formdata[0].textarea,
                        prefaceValue: formdata[0].preface,
                    });

                    console.log('Response :', response.data);
                    resData = response.data;
                    refreshFormData();
                    return resData;
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                console.log("No formdata")
                return "No textareaValue"
            }
        }

    }
