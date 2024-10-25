import { useState, useEffect } from 'react';
import moment from 'moment';
import { CiLock } from "react-icons/ci";
import checkIn from '../../../assets/img/in.png';
import checkOut from '../../../assets/img/out.png';
import Hrs from '../../../assets/img/hrs.png';
import avatar from '../../../assets/img/avatar.png';
import { IoIosCheckmarkCircle } from "react-icons/io";
import BackButton from '../BackButton';
import { Link } from 'react-router-dom';

const CheckInOutPassword = () => {
  const [time, setTime] = useState(moment().format('h:mm a'));
  const [date, setDate] = useState(moment().format('MMMM Do, YYYY'));
  const [checkInTime, setCheckInTime] = useState(localStorage.getItem('checkInTime') || null);
  const [checkOutTime, setCheckOutTime] = useState(localStorage.getItem('checkOutTime') || null);
  const [totalHours, setTotalHours] = useState('--:--');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState('User'); // Hardcoded for demo
  const [storedPasswords, setStoredPasswords] = useState(['123456', 'password2', 'password3', 'password4', 'password5']);

  // Calculate total hours worked whenever checkInTime or checkOutTime changes
  useEffect(() => {
    const calculateTotalHours = () => {
      if (checkInTime && checkOutTime) {
        const checkInMoment = moment(checkInTime, 'h:mm a');
        const checkOutMoment = moment(checkOutTime, 'h:mm a');
        const diffInHours = checkOutMoment.diff(checkInMoment, 'hours', true);
        const hours = Math.floor(diffInHours);
        const minutes = Math.round((diffInHours - hours) * 60);
        setTotalHours(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
      } else {
        setTotalHours('--:--');
      }
    };
    
    calculateTotalHours();
  }, [checkInTime, checkOutTime]);

  // Check-in/out action
  const handleAction = () => {
    const inputPassword = password.trim();
    if (storedPasswords.includes(inputPassword)) {
      // Check-in or check-out logic
      if (!checkInTime) {
        const currentTime = moment().format('h:mm a');
        setCheckInTime(currentTime);
        localStorage.setItem('checkInTime', currentTime);
        setErrorMessage('');
      } else if (!checkOutTime) {
        const currentTime = moment().format('h:mm a');
        setCheckOutTime(currentTime);
        localStorage.setItem('checkOutTime', currentTime);
        setErrorMessage('');
      }
    } else {
      setErrorMessage('Incorrect password. Try again.');
    }
  };

  return (
    <div className="card-body">
      <BackButton />
      <div className="card-inner">
        <div className="heading">
          <div className="greeting">
            <h2>Hey {userName}!</h2>
            <p>{checkInTime ? 'Remember to Check Out.' : 'Check In Today.'}</p>
          </div>
          <div className="profile-picture">
            <img src={userImage || avatar} alt="Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%' }} />
          </div>
        </div>

        <div className="time-display">
          <h1>{time}</h1>
          <p>{date}</p>
        </div>

        <div className="checkin-section">
          <h3>{checkInTime ? <span style={{ color: '#E35B5B' }}>Check Out</span> : <span style={{ color: '#55B841' }}>Check In</span>}</h3>

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
            {errorMessage && <p className='incorrectPass'>{errorMessage}</p>}
          </div>
        </div>

        <div className="status-section">
          <div>
            <img src={checkIn} style={{ width: '33px' }} alt="CheckIn" />
            <h2>{checkInTime || '--:--'}</h2>
            <p>Check In</p>
          </div>
          <div>
            <img src={checkOut} style={{ width: '28px' }} alt="CheckOut" />
            <h2>{checkOutTime || '--:--'}</h2>
            <p>Check Out</p>
          </div>
          <div>
            <img src={Hrs} style={{ width: '33px' }} alt="Hrs" />
            <h2>{totalHours || '--:--'}</h2>
            <p>Total Hrs</p>
          </div>
        </div>

        <div className="footer-nav check-card">
          <Link to="/signin"><button>Home</button></Link>
          <Link to="/history"><button>History</button></Link>
          <Link to="/profile"><button>Profile</button></Link>
        </div>
      </div>
    </div>
  );
};

export default CheckInOutPassword;
