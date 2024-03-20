import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Navbar';
//import Home from './Home';
import Calendar from './Calender';
import Message from './Message/Message';
//import Data from './Data';
//import Setting from './Setting';
//import Exit from './Exit';

import '../styles/Main.css';
import { connect , useSelector } from 'react-redux';
import { useCompareData } from '../component/useCompareData';
import EzMsg from './EzMsg';

function Main() {

  const overviewState = useSelector((state) => state.overviewstate);
  console.log(overviewState);

  return (
    <div className='Main_div'>
      { overviewState && <span className="isSending"></span> }

      <NavBar />
      <Routes>
        {/* <Route path="home" element={<Home />} /> */}
        <Route path="calender" element={<Calendar />} />
        <Route path="message" element={<Message />} />
        {/* <Route path="data" element={<Data />} /> */}
        {/* <Route path="setting" element={<Setting />} /> */}
        {/* <Route path="exit" element={<Exit />} /> */}
      </Routes>
    </div>
  );
}

export default Main;
