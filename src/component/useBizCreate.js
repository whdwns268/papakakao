// useCompareData.js
import { useSelector, useDispatch } from 'react-redux';
import { setCompareData } from '../actions';
import axios from 'axios';

export function useBizCreate() {

    const isbizHotData = useSelector(state => state.bizHotData);

    const dispatch = useDispatch();

    return async () => {

        const filteredBizHotData = isbizHotData.filter(array => !array.every(item => item === ""));
        console.log(filteredBizHotData)

        try { //크루명으로 db에서 데이터 뽑아내기
            for (const data of filteredBizHotData) {
                console.log(data);

                //예약일자 나누기
                let BizReserveYYMMDD = data[5].split('-');
                let reserveMonth = BizReserveYYMMDD[1]
                let reserveDay = BizReserveYYMMDD[2]

                let BizReserveHHMM = data[6].split(':');
                let reserveHH = BizReserveHHMM[0]
                let reserveMM = BizReserveHHMM[1]
                let reserveAMPM = BizReserveHHMM[2].split(' ');
                let reserveAP = reserveAMPM[1]
                const response = await axios.post('/bizCreate', {
                    travelType: data[0],
                    vehicleType: data[1],
                    periodTime: data[2],
                    departure: data[3],
                    destination: data[4],
                    reserveMonth : reserveMonth,
                    reserveDay : reserveDay,
                    reserveHH : reserveHH,
                    reserveMM : reserveMM,
                    reserveAP : reserveAP,
                    passenger : data[7],
                    passengerPhone : data[8],
                    usePurpose : data[9],
                    personnel : data[10],
                    otherText : data[11],
                });

                console.log(response);

            }


        } catch (error) {
            console.error('Error:', error);
        }
    }
}