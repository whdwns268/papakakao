// store.js
import { createStore } from 'redux';
import rootReducer from './reducers'; // 모든 리듀서를 결합한 rootReducer를 import합니다.

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Redux Devtools 확장 프로그램을 사용하는 경우 추가합니다.
);

export default store;
