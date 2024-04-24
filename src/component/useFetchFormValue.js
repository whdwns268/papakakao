import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFormValue } from '../actions';

const useFetchFormValue = () => {
    const dispatch = useDispatch();
    const [refreshIndex, setRefreshIndex] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.post('/formDataGet');
            console.log(response.data);
            dispatch(setFormValue(response.data));
        } catch (error) {
            console.error('데이터를 가져오는 데 실패했습니다.', error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshIndex]);

    const refreshFormData = () => {
        setRefreshIndex(prevIndex => prevIndex + 1);
    };

    return { refreshFormData };
};

export default useFetchFormValue;
