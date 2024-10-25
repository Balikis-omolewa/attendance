import React from 'react'
import { Link } from 'react-router-dom'
import { LuUser2 } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { FaHome } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-nav check-card">
    <Link to="/signin">
    <div style={{ fontSize: "15px", marginTop: "-5px", display: "flex", justifyContent: "center", alignItems: "center"}} >
    <button> <FaHome style={{ fontSize: "15px", marginTop: "-5px",}} /> <span>Home</span></button>
    </div>
    
    </Link>
    {/* <Link to="/history"> */}
    <button><SlCalender style={{ fontSize: "15px", marginTop: "-5px"}} /> History</button>
    {/* </Link> */}
    <Link to="/profile">
    <button><LuUser2 style={{ fontSize: "15px", marginTop: "-5px"}} /> Profile</button>
    </Link>
   
  </div>
  )
}

export default Footer