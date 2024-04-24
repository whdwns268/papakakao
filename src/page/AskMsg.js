import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setOverviewState } from '../actions';

function AskMsg({TitleMsgText, MsgText, setShowAskMsg, showAskMsg , onUserChoice , executeOnYes}) {

    const overviewState = useSelector((state) => state.overviewstate);
    const dispatch = useDispatch();
    const [scale, setScale] = useState('scale(0.0)');

    useEffect(() => {
        setScale('scale(1)'); // 컴포넌트가 마운트된 후 scale을 1로 변경
    }, []);


    // 트랜지션 종료 이벤트 핸들러
    function handleTransitionEnd() {
        if (scale === 'scale(0)') {
            setShowAskMsg(!showAskMsg); // 트랜지션이 축소 방향으로 완료된 경우 컴포넌트 닫기
            if (overviewState === true) {
                console.log(overviewState)
                dispatch(setOverviewState(false));
            } else if (overviewState === false) {
                console.log(overviewState)
            }
        }
    }

    // Yes 버튼 클릭 핸들러
    function setAskMsgBtn_yes() {
        setScale('scale(0)'); // 역방향 트랜지션 적용  
        onUserChoice("YES");
        if(executeOnYes){
            executeOnYes();
        }
    }

    // NO 버튼 클릭 핸들러
    function setAskMsgBtn_no() {
        setScale('scale(0)'); // 역방향 트랜지션 적용   
        onUserChoice("NO");
    }

    const AskMsg_Style = {
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

    const AskMsg_Style_span1 = {
        fontSize: '24px',
        fontWeight: '700',
    };

    const AskMsg_Style_span2 = {
        fontSize: '17px',
        fontWeight: '400',
        height: '70px',
        lineHeight: '70px',
        color: '#54595E95',
    };

    const AskMsg_Style_btn_no = {
        fontSize: '17px',
        fontWeight: '600',
        width: '200px',
        height: '50px',
        borderRadius: '8px',
        color: '#4F4F4F',
        border: '1px solid #4F4F4F',
        backgroundColor: 'white',
    };

    const AskMsg_Style_btn_yes = {
        fontSize: '17px',
        fontWeight: '600',
        width: '200px',
        height: '50px',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: '#4F4F4F',
        border: 'none',
    };

    const AskMsg_Style_div_btn = {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-evenly',
    }

    return (
        <div style={AskMsg_Style} onTransitionEnd={handleTransitionEnd}>
            <span style={AskMsg_Style_span1}>{TitleMsgText}</span>
            <span style={AskMsg_Style_span2}>{MsgText}</span>
            <div style={AskMsg_Style_div_btn}>
                <button style={AskMsg_Style_btn_no} type="button" onClick={setAskMsgBtn_no}>
                    NO
                </button>
                <button style={AskMsg_Style_btn_yes} type="button" onClick={setAskMsgBtn_yes}>
                    YES
                </button>
            </div>
        </div>
    );
}

export default AskMsg;
