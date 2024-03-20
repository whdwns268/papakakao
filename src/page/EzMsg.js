import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setOverviewState } from '../actions';

function EzMsg({ MsgText, setShowEzMsg, showEzMsg }) {
    
    const dispatch = useDispatch();

    const [scale, setScale] = useState('scale(0.0)');

    useEffect(() => {
        setScale('scale(1)'); // 컴포넌트가 마운트된 후 scale을 1로 변경
    },[]);

    
    // 트랜지션 종료 이벤트 핸들러
    function handleTransitionEnd() {
        if (scale === 'scale(0)') {
            setShowEzMsg(!showEzMsg); // 트랜지션이 축소 방향으로 완료된 경우 컴포넌트 닫기
            dispatch(setOverviewState());
        }
    }

    // 닫기 버튼 클릭 핸들러
    function setEzMsgBtn() {
        setScale('scale(0)'); // 역방향 트랜지션 적용    
    }

    const EzMsg_Style = {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        color: '#54595E',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #DEE2E6',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        transform: scale,
        transition: 'transform 0.2s ease-out',
    };

    const EzMsg_Style_span1 = {
        fontSize: '24px',
        fontWeight: '700',
    };

    const EzMsg_Style_span2 = {
        fontSize: '17px',
        fontWeight: '400',
        height: '70px',
        lineHeight: '70px',
        color: '#54595E95',
    };

    const EzMsg_Style_btn = {
        fontSize: '17px',
        fontWeight: '600',
        width: '200px',
        height: '50px',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: '#4F4F4F',
        border: 'none',
    };

    return (
        <div style={EzMsg_Style} onTransitionEnd={handleTransitionEnd}>
            <span style={EzMsg_Style_span1}>확인이 필요합니다</span>
            <span style={EzMsg_Style_span2}>{MsgText}</span>
            <button style={EzMsg_Style_btn} type="button" onClick={setEzMsgBtn}>
                닫기
            </button>
        </div>
    );
}

export default EzMsg;
