import React from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import './Main.css'

class Main extends React.Component {
    componentDidMount() {
        this.hot = new Handsontable(this.hotElement, {
            data: Array.from({ length: 40 }, () => Array(10).fill('')),
            rowHeaders: true, // 행 헤더를 표시합니다.
            colHeaders: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // 열 헤더를 설정합니다.
            width: '65%',
            height: '95%',
            overflow: 'scroll',
            licenseKey: 'non-commercial-and-evaluation', // 비상업적 사용 및 평가용 라이선스 키입니다.
        });
    }

    componentWillUnmount() {
        if (this.hot) {
            this.hot.destroy(); // 컴포넌트가 언마운트될 때 Handsontable 인스턴스를 제거합니다.
        }
    }

    render() {
        return (
            <div className="main_div">
                <div className="table_div_css" ref={ref => this.hotElement = ref} />
                <div>
                글씨보여주기
                </div>
            </div>
        );
    }
}

export default Main;
