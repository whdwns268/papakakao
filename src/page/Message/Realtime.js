import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../styles/Realtime.css'
import { setOverviewState } from '../../actions';

function Realtime({ isDataSendingList, setIsDataSendingList }) {

    const dispatch = useDispatch();

    const comparedata = useSelector((state) => state.comparedata);
    const [comparedata_View, setComparedata_View] = useState([])
    const [imageSrc, setImageSrc] = useState('');


    useEffect(() => {
        const wsProtocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
        const ws = new WebSocket(wsProtocol + '//' + window.location.host + '/');
        console.log(wsProtocol + '//' + window.location.host + '/')
        console.log(ws)

        // 바이너리 데이터를 받기 위해 binaryType을 blob으로 설정합니다.
        ws.binaryType = 'blob';

        ws.onmessage = function (event) {
            // event.data는 Blob 객체입니다.
            const blob = event.data;
            // Blob 객체를 URL로 변환합니다.
            const imageUrl = URL.createObjectURL(blob);
            // 이미지 URL을 상태에 저장하여 이미지 태그의 소스로 사용합니다.
            setImageSrc(imageUrl);
        };

        return () => {
            ws.close(); // WebSocket 연결을 종료합니다.
        };

    }, []);


    useEffect(() => {
        console.log(comparedata["Count"]);
        // comparedata의 길이에 따라 조건을 확인하고, 상태를 업데이트합니다.
        if (comparedata["Count"] === 1) {
            setComparedata_View([comparedata]); // 배열 상태로 초기화
            //console.log(comparedata_View);
        } else if ((comparedata["Count"] > 1)) {
            setComparedata_View(prev => [...prev, comparedata]); // 이전 배열 상태에 새로운 데이터 추가
            //console.log(comparedata_View);
        }


    }, [comparedata]); // comparedata가 변경될 때마다 useEffect가 실행됩니다.

    useEffect(() => {
        console.log(comparedata_View); // 상태가 업데이트된 후의 값을 출력
    }, [comparedata_View]);

    function handle_SendingList_Close() {
        setIsDataSendingList(!isDataSendingList);
        dispatch(setOverviewState());
    }

    return (
        <ul className='SendingList_ul'>
            <li>{imageSrc && <img src={imageSrc} alt="이미지" />}</li>
            <li>
                <ul className='RealTime_Send_History RealTime_fontbold'>
                    <li>이름</li>
                    <li>발송내용</li>
                    <li>파일명</li>
                    <li>상태</li>
                </ul>
                <div className='RealTime_Send_History_div'>
                {comparedata_View.map((data, index) => (
                    // 로딩 중인 데이터 보여주기
                    <ul className='RealTime_Send_History RealTime_inbox' key={index}>
                        <li>{data.crewname}</li>
                        <li>{data.Count}</li>
                        <li>{data.Count}</li>
                        <li>{data.Count}</li>
                    </ul>
                ))}
                </div>
                <ul className='SendingList_count'>
                    <li>총 발송 요청 : 30</li>
                    <li>발송완료 :27</li>
                    <li>발송실패 : 3</li>
                    <li>발송 진행 중 ...</li>
                    <li><button type='button' onClick={handle_SendingList_Close}>닫기</button></li>
                </ul>
            </li>
            {/* <li><img src={Loader} /></li> */}
        </ul>
    )
}

export default Realtime;