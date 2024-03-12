// src/actions/index.js
export const SET_TEXTAREA_VALUE = 'SET_TEXTAREA_VALUE';
export const SET_CELL_DATA = 'SET_CELL_DATA';
export const SET_HANDSONTABLE_CONFIG = 'SET_HANDSONTABLE_CONFIG';
export const SET_HANDSONTABLE_DATA = 'SET_HANDSONTABLE_DATA';
export const SET_PREFACE_VALUE = 'SET_PREFACE_VALUE';


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