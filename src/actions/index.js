// src/actions/index.js
export const SET_TEXTAREA_VALUE = 'SET_TEXTAREA_VALUE';
export const SET_CELL_DATA = 'SET_CELL_DATA';
export const SET_HANDSONTABLE_CONFIG = 'SET_HANDSONTABLE_CONFIG';
export const SET_HANDSONTABLE_DATA = 'SET_HANDSONTABLE_DATA';
export const SET_PREFACE_VALUE = 'SET_PREFACE_VALUE';
export const SET_COMPARE_DATA = 'SET_COMPARE_DATA';
export const SET_OVERVIEW_STATE = 'SET_OVERVIEW_STATE';
export const SET_FILE_VALUE = 'SET_FILE_VALUE';
export const SET_NAMECOLUMNS_VALUE = 'SET_NAMECOLUMNS_VALUE';
export const SET_FORM_VALUE = 'SET_FORM_VALUE';
export const SET_BIZHOT_DATA = 'SET_BIZHOT_DATA';

export function setPrefaceValue(value) {
  return { type: SET_PREFACE_VALUE, value };
}

export function setTextareaValue(value) {
  return { type: SET_TEXTAREA_VALUE, value };
}

export function setCellData(value) {
  return { type: SET_CELL_DATA, value };
}

export function setHandsontableConfig(value) {
  return { type: SET_HANDSONTABLE_CONFIG, value };
}

export function setHandsontableData(value) {
  return { type: SET_HANDSONTABLE_DATA, value };
}

export function setCompareData(value) {
  return { type: SET_COMPARE_DATA, value };
}

export function setFileValue(value) {
  return { type: SET_FILE_VALUE, value };
}

export function setNameColumnsValue(value) {
  return { type: SET_NAMECOLUMNS_VALUE, value };
}

export function setFormValue(value) {
  return { type: SET_FORM_VALUE, value };
}

export function setBizHotData(value) {
  return { type: SET_BIZHOT_DATA, value };
}

export function setOverviewState() {
  return { type: SET_OVERVIEW_STATE };
}

