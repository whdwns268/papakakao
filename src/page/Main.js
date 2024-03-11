import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Navbar';
//import Home from './Home';
import Calendar from './Calender';
import Message from './Message';
//import Data from './Data';
//import Setting from './Setting';
//import Exit from './Exit';

import './Main.css';

function Main() {
  return (
    <div className='Main_div'>
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
