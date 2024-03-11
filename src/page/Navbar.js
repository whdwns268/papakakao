import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'
import logo from '../M_logo.svg';
import Calender from '../ico/calender.svg';
import Data from '../ico/data.svg';
import Exit from '../ico/exit.svg';
import Home from '../ico/home.svg';
import Message from '../ico/message.svg';
import Setting from '../ico/setting.svg';


function Navbar() {
  const [activeIndex, setActiveIndex] = useState(null);

  const icons = [Home, Calender, Message, Data, Setting, Exit];
  const paths = ["/main/home", "/main/calender", "/main/message", "/main/data", "/main/setting", "/main/exit"];


  return (
    <div className='navbar_div'>
      <div><img src={logo} /></div>
      <span>
        {icons.map((icon, index) => (
          <NavLink 
            key={index}
            to={paths[index]}
            onClick={() => setActiveIndex(index)} 
            className={activeIndex === index ? 'active' : ''}
          >
            <img src={icon} />
          </NavLink>
        ))}
      </span>
      <div></div>
    </div>
  );
}

export default Navbar;