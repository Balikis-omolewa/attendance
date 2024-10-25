// src/components/CheckInOutPassword/Content.js
import React from 'react';
import { CiLock } from "react-icons/ci";
import { IoIosCheckmarkCircle } from "react-icons/io";

const Content = ({
  time,
  date,
  checkInTime,
  checkOutTime,
  password,
  setPassword,
  handleAction,
  errorMessage,
}) => {
  return (
    <div className="checkin-section">
      <div className="time-display">
        <h1>{time}</h1>
        <p>{date}</p>
      </div>

      <h3>
        {checkInTime ? (
          <span style={{ color: '#E35B5B' }}>Check Out</span>
        ) : (
          <span style={{ color: '#55B841' }}>Check In</span>
        )}
      </h3>

      <div className="form-group" style={{ marginTop: '8%' }}>
        <div className="form-field">
          <CiLock className="icon" style={{ fontSize: "1.8rem", color: "#467AFB" }} />
          <input
            type="password"
            placeholder="Input Password"
            value={password}
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            disabled={!!checkOutTime}
          />
          <IoIosCheckmarkCircle
            style={{ color: '#55B841', fontSize: '2rem', cursor: 'pointer' }}
            onClick={handleAction}
          />
        </div>
        {errorMessage && <p className="incorrectPass">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Content;
