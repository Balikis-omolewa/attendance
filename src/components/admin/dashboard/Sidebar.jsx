import React from 'react';
import logoApp from '../../../assets/img/logo.png';
import { MdOutlineDashboard, MdLogout, MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuUser2 } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import '../styles/Sidebar.css';

const Sidebar = ({ updateScreen }) => {

  const handleClick = (screen) => {
    updateScreen(screen);
  }

  return (
    <div className='header-menu'>
      <div className='logoApp'>
        <img src={logoApp} alt="App Logo" />
      </div>

      <div className='header-menu-list'>
        <button className='item active' onClick={() => handleClick("dashboard") }>
          <MdOutlineDashboard className='icon'/> Dashboard
        </button>
        <button className='item' onClick={() => handleClick("userReports") }>
          <LuUser2 className='icon'/> Users Information
        </button>
        <button className='item' onClick={() => handleClick("adminAccess") }>
        <SlLocationPin className='icon'/> Add Loacation
        </button>
        <button className='item' onClick={() => handleClick("attendanceHistory") }>
          <MdOutlineAdminPanelSettings className='icon'/> Attendance History
        </button>
        <button className='item' onClick={() => handleClick("settings") }>
        <IoSettingsOutline className='icon'/> Settings 
        </button>
        <div className="footer">
          <hr />
          <button className='item'>
            <MdLogout className='icon'/> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
