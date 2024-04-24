import React, { useEffect, useRef, useState } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { setBizHotData } from '../../actions';
import TGAjson from './TGA.json';
import { useBizCreate } from '../../component/useBizCreate';
import '../../styles/BizReserve.css'
import Select from "react-select";

function BizReserve(props) {

    const [TGASelect, setTGASelect] = useState(TGAjson.TIME);
    const hotRef = useRef(null); // DOM 요소에 대한 참조 생성
    const [hot, setHot] = useState(null);
    const [reserveType, setReserveType] = useState("TIME");
    const [colHeadersName, setColHeadersName] = useState(Object.keys(TGAjson.TIME));
    const isbizHotData = useSelector(state => state.bizHotData);
    const bizSelectRef = useRef(null);
    const [se_reserveType, setSE_ReserveType] = useState({value:"", label:"선택"});
    const [se_selectedValue, setSE_SelectedValue] = useState({value:"", label:"선택"});


    const templates = [
        { value: "파라다이스시티", label: "파라다이스시티" },
        { value: "offlone", label: "오프라인" }
    ]

    const [selectTemplates, setSelectTemplates] = useState(templates[0]);

    useEffect(() => {
        setTGASelect(TGAjson[reserveType])
        setColHeadersName(Object.keys(TGASelect));
        setSE_SelectedValue({value:"", label:"선택"})
        setSE_ReserveType({value:"", label:"선택"})
    },[reserveType, TGASelect])

    useEffect(() => {
        // 이미 hot 인스턴스가 존재하면 파괴함
        if (hot) {
            hot.destroy();
        }

        

        const initialData = Array.from({ length: 50 }, () => new Array(colHeadersName.length).fill(""));
        const hotSettings = {
            licenseKey: 'non-commercial-and-evaluation',
            width: 'calc ( 100% - 500px )',
            height: '100%',
            overflow: 'scroll',
            data: isbizHotData || initialData, // 초기 데이터, 필요에 따라 수정
            colHeaders: colHeadersName, // 열 헤더를 표시하려면 true로 설정
            rowHeaders: true, // 행 헤더를 표시하려면 true로 설정
            dropdownMenu: true, // 드롭다운 메뉴 활성화
            contextMenu: true, // 컨텍스트 메뉴 활성화
            stretchH: 'all',
            columns: TGASelect.columns,
            afterChange: (changes, source) => {
                if (source !== 'loadData') {
                    props.setBizHotData(hotSettings.data);
                }
            },
        };

        // Handsontable 인스턴스를 생성함
        const hotInstance = new Handsontable(hotRef.current, hotSettings);
        setHot(hotInstance);

        // 컴포넌트가 언마운트 될 때 실행될 클린업 함수
        // return () => {
        //     if (hotInstance) {
        //         hotInstance.destroy();
        //     }
        // };
    }, [colHeadersName]);

    useEffect(() => {
        function handleButtonClick(event) {
            const buttons = bizSelectRef.current.querySelectorAll('span');
            buttons.forEach((btn, index) => {
                btn.style.color = '#2E2E2E';
            });
            const button = event.target;
            const moveDistance = 136 * Array.from(buttons).indexOf(button);
            button.style.color = 'white';
            buttons[3].style.transform = `translateX(${moveDistance}px)`;
            setReserveType(event.currentTarget.textContent)
        };

        const buttons = bizSelectRef.current.querySelectorAll('span');

        buttons.forEach(button => {
            button.addEventListener('click', handleButtonClick);
        });
    }, []);


    const setBizCreateGo = useBizCreate(); //데이터 실행
    function handle_CreateReserve() {
        setBizCreateGo();
    }

    function handleChange_reserveType(selectedOption){
        setSE_ReserveType(selectedOption)
    }

    function handleChange_selectValue(selectedOption){
        setSE_SelectedValue(selectedOption)
    }


    return (
        <div className="BizReserve_div">
            <div ref={hotRef}></div>
            <div>
                <span className='BizReserve_index'>
                    <ul className='BizReserve_index_ul'>
                        {/* 최상단 상품 / 템플릿 선택 부분 */}
                        <li>
                            <div className='bizSelect_div' ref={bizSelectRef}>
                                <span>TIME</span>
                                <span>AIR</span>
                                <span>GOLF</span>
                                <span className='silder_box'></span>
                            </div>
                            <div className='Templates_Top'>
                                <span>Templates({reserveType})</span>
                                <div>
                                    <span>ADMIN</span>
                                    <span>문종준</span>
                                </div>
                            </div>
                            <div>
                                <Select options={templates} defaultValue={templates[0]}/>
                            </div>
                        </li>

                        {/* 중간 템플릿 인덱스 부분 */}
                        <li>
                            <div className='temple_index_double'>
                                <div>
                                    <span>여정유형</span>
                                    <span style={{ width : "100%" }}><Select options={TGASelect.reserveType} value={se_reserveType} onChange={handleChange_reserveType}/></span>
                                </div>
                                <div>
                                    <span>{TGASelect.selectValueName}</span>
                                    <span style={{ width : "100%" }}><Select options={TGASelect.selectValue} value={se_selectedValue} onChange={handleChange_selectValue}/></span>
                                </div>
                            </div>
                            <div>
                                <span>출발지</span>
                                <input type='text'></input>
                            </div>
                            <div>
                                <span>목적지</span>
                                <input type='text'></input>
                            </div>
                            <div>
                                <span>탑승자 이름</span>
                                <input type='text'></input>
                            </div>
                            <div>
                                <span>탑승자 연락처</span>
                                <input type='text'></input>
                            </div>
                            <div>
                                <div>
                                    <span>탑승인원</span>
                                    <select>
                                        <option>1명</option>
                                    </select>
                                </div>
                                <div>
                                    <span>수하물 정보</span>
                                    <input type='text'></input>
                                </div>
                            </div>
                            <div>
                                <span>기타 요청사항</span>
                                <textarea />
                            </div>
                            <div>
                                <button type='button'>템플릿 삭제</button>
                                <button type='button'>템플릿 저장</button>
                                <button type='button'>템플릿 사용</button>
                            </div>
                        </li>
                    </ul>
                    {/* 하단 생성버튼 */}
                    <div>
                        <button onClick={handle_CreateReserve} type='button'>비즈니스 예약 생성</button>
                    </div>
                </span>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    // Redux store로부터 props로 매핑할 상태
    bizHotData: state.bizHotData,
});

const mapDispatchToProps = {
    setBizHotData
};

export default connect(mapStateToProps, mapDispatchToProps)(BizReserve);
