// src/reducers/index.js
import {
  SET_PREFACE_VALUE,
  SET_TEXTAREA_VALUE,
  SET_CELL_DATA,
  SET_HANDSONTABLE_CONFIG,
  SET_HANDSONTABLE_DATA,
  SET_COMPARE_DATA,
  SET_OVERVIEW_STATE,
} from '../actions';

const initialState = {
  prefaceValue: '',
  textareaValue: '',
  cellData: '',
  comparedata: '',
  overviewstate: false,
  config: {
    data: Array.from({ length: 150 }, () => Array(50).fill('')),
    rowHeaders: true, // 행 헤더를 표시합니다.
    colHeaders: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // 열 헤더를 설정합니다.
    width: '65%',
    height: '100%',
    overflow: 'scroll',
    licenseKey: 'non-commercial-and-evaluation',
  },
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PREFACE_VALUE:
      return { ...state, prefaceValue: action.value };
    case SET_TEXTAREA_VALUE:
      return { ...state, textareaValue: action.value };
    case SET_CELL_DATA:
      return { ...state, cellData: action.value };
    case SET_HANDSONTABLE_CONFIG:
      return { ...state, config: action.value };
    case SET_HANDSONTABLE_DATA:
      return { ...state, data: action.value };
    case SET_COMPARE_DATA:
      return { ...state, comparedata: action.value };
    case SET_OVERVIEW_STATE:
      return { ...state, overviewstate: !state.overviewstate };

    default:
      return state;
  }
}

export default rootReducer;