import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // useNavigate 추가
import NavBar from './Navbar';
//import Home from './Home';
import Calendar from './Calendar';
import Message from './Message/Message';
import BizReserve from './BizReserve/BizReserve';
//import Data from './Data';
//import Setting from './Setting';
//import Exit from './Exit';
import axios from 'axios';

import '../styles/Main.css';
import { useSelector } from 'react-redux';

function Main() {



  const overviewState = useSelector((state) => state.overviewstate);

  const location = useLocation();


  return (
    <div className='Main_div'>
      {overviewState && <span className="isSending"></span>}

      <NavBar />
      <Routes>
        {/* <Route path="home" element={<Home />} /> */}
        <Route path="calendar" element={<Calendar />} />
        <Route path="message" element={<Message />} />
        {/* <Route path="data" element={<Data />} /> */}
        <Route path="bizreserve" element={<BizReserve />} />
        {/* <Route path="setting" element={<Setting />} /> */}
        {/* <Route path="exit" element={<Exit />} /> */}
      </Routes>
    </div>
  );
}

export default Main;
