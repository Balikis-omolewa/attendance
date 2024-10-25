import React, { useState } from 'react';
import { IoCaretForward } from "react-icons/io5";
import Footer from './checkInCheckOut/Footer';
import Modal from './Modal'; 
import { FaFingerprint } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MdLogout, MdLockPerson } from "react-icons/md";
import { LuUser2 } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import BackButton from './BackButton';
import zIndex from '@mui/material/styles/zIndex';

const ProfilePage = () => {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  // Dynamic date and time
  const currentDate = new Date().toLocaleDateString(); 
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card-body">
      <BackButton style={{ color: "#4A82DD", fontSize: "20px" }} />
      {/* Profile Header */}
      <div className="card-inner">
        <div className="card-heading" style={{ marginBottom: "30px" }}>
          <h4 className="greeting">Hey!!!</h4>
         <div 
         style={{display: "flex", justifyContent: "center"}}>
 <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="profile-pic"
          />
         </div>
          <h2>Balikis Omolewa</h2><br />
          <p className="job-title">Front-end Developer</p>
        </div>

        {/* Date and Time */}
        <div className="menu-item datetime">
          <div className="menu-header">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "10px" }}>
              <span style={{ color: "#4A82DD" }}><SlCalender /></span>&nbsp; &nbsp;
              <div>
                <b><span className="date">{currentDate}</span></b><br />
                <span className="time">{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Menu Items */}
        <div className="menu-item">
          <div className="menu-header">
            <div style={{display: "flex"}}>
              <span style={{ color: "#4A82DD", fontSize: "20px" }}><LuUser2 /></span>&nbsp; &nbsp;
              <Link to="/userprofile" style={{ textDecoration: "none", color: "#000" }}>
              <span>Personal Details</span></Link>
            </div>
            <span><IoCaretForward /></span>
          </div>
        </div>

        <div className="menu-item">
          <div className="menu-header">
            <div style={{display: "flex"}}>
              <span style={{ color: "#4A82DD", fontSize: "20px" }}><MdLockPerson /></span>&nbsp; &nbsp;
              <Link to="/forgot-password" style={{ textDecoration: "none", color: "#000" }}>
                <span>Change Password</span></Link>
            </div>
            <span><IoCaretForward /></span>
          </div>
        </div>

        <div className="menu-item" onClick={() => openModal(
          <div className="biometrics-modal-content">
            <p style={{ textAlign: "left" }}>Enable</p>
            <span className="fingerprint">
              <FaFingerprint className="fingerprint-image" />
            </span>
            <p>Touch the fingerprint sensor</p>
          </div>
        )}>
          <div className="menu-header">
            <div style={{display: "flex"}}>
              <span style={{ color: "#4A82DD", fontSize: "20px" }}><FaFingerprint /></span>&nbsp; &nbsp;
              <span>Enable Biometrics</span>
            </div>
            <span><IoCaretForward /></span>
          </div>
        </div>

        <div className="menu-item">
          <div className="menu-header">
            <div style={{display: "flex"}}>
              <span style={{ color: "#4A82DD", fontSize: "20px" }}><MdLogout /></span>&nbsp; &nbsp;
              <Link to="/signin" style={{ textDecoration: "none", color: "#000" }}>
                <span>Logout</span></Link>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <Footer />
      </div>

      {/* Modal Component */}
      <Modal isOpen={!!modalContent} onClose={closeModal} style={{zIndex: "9000000"}}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default ProfilePage;
