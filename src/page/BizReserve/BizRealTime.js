import '../../styles/BizRealTime.css'
import { connect, useDispatch, useSelector } from 'react-redux';
import { setBizHotData, setOverviewState } from '../../actions';

function BizRealTime() {

    const isbizHotData = useSelector(state => state.bizHotData);

    const filteredBizHotData = isbizHotData.filter(array => !array.every(item => item === ""));
    console.log(filteredBizHotData)

    return (
        <div className='BizRealTime_div'>
            <div>실시간 예약생성 내역 (개발 중입니다. 실제 생성은 가능하니 생성확인 후 종료하셈)</div>
            <div>절전모드에 들어가지 않도록 주의해주세요.</div>
            <div>
                <ul className='BizRealTime_ul'>
                    <li>여정유형</li>
                    <li>예약시간</li>
                    <li>출도착지</li>
                    <li>탑승자명</li>
                    <li>탑승자 연락처</li>
                    <li>기타요청사항</li>
                </ul>
            </div>
            <div>
                {filteredBizHotData.map((data, index) => (
                    <ul key={index} className='BizRealTime_ul BizRealTime_ul_index' >
                        <li>
                            <div>{data[1]}</div>
                            <div>[{data[0]}]</div>
                        </li>
                        <li>{data[5]} {data[6]}</li>
                        <li>
                            <div>{data[3]}</div>
                            <span>3시간 50km</span>
                            <div>{data[4]}</div>
                        </li>
                        <li>{data[7]}</li>
                        <li>{data[8]}</li>
                        <li>{data[11]}</li>
                        <li><button type='button'>O</button></li>
                    </ul>
                ))}
            </div>

            <div>
                <button>일시 정지</button>
                <button>종료</button>
            </div>
        </div>
    )
}

export default BizRealTime;