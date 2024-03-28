import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // useNavigate 추가
import NavBar from './Navbar';
//import Home from './Home';
import Calendar from './Calendar';
import Message from './Message/Message';
//import Data from './Data';
//import Setting from './Setting';
//import Exit from './Exit';

import '../styles/Main.css';
import { useSelector } from 'react-redux';

function Main() {
  const navigate = useNavigate(); // useNavigate 사용

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authToken') === null;
    // 이미 인증된 경우 메인페이지로 리다이렉트
    if (isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const overviewState = useSelector((state) => state.overviewstate);

  return (
    <div className='Main_div'>
      { overviewState && <span className="isSending"></span> }

      <NavBar />
      <Routes>
        {/* <Route path="home" element={<Home />} /> */}
        <Route path="calendar" element={<Calendar />} />
        <Route path="message" element={<Message />} />
        {/* <Route path="data" element={<Data />} /> */}
        {/* <Route path="setting" element={<Setting />} /> */}
        {/* <Route path="exit" element={<Exit />} /> */}
      </Routes>
    </div>
  );
}

export default Main;
