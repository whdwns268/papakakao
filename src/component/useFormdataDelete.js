import { useSelector, useDispatch } from 'react-redux';
import { setCompareData } from '../actions'; 
import axios from 'axios';
import useFetchFormValue from './useFetchFormValue.js';

export function useFormdataDelete(formSelectItem) {
    const { refreshFormData } = useFetchFormValue();

    let formid = formSelectItem.formSelectItem._id;
    return async ()=>{
        try { 
            const response = await axios.post('/formDataDelete', {
                formnid: formid,
            });
            console.log('Response :', response.data);
            refreshFormData();
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
