import { useState, useEffect } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import  BiometricIcon  from '../../../assets/icons/checkin.png';
import  BiometricIconOut  from '../../../assets/icons/checkout.png';
import checkIn from '../../../assets/img/in.png';
import checkOut from '../../../assets/img/out.png';
import Hrs from '../../../assets/img/hrs.png';
import BackButton from '../BackButton';
import Header from './HeaderFile';
import Footer from './Footer';

const CheckInOutBiometric = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userNameFromSignup = location.state?.name || '';

  const [time, setTime] = useState(moment().format('h:mm a'));
  const [date, setDate] = useState(moment().format('MMMM Do, YYYY'));
  const [checkInTime, setCheckInTime] = useState(localStorage.getItem('checkInTime') || null);
  const [checkOutTime, setCheckOutTime] = useState(localStorage.getItem('checkOutTime') || null);
  const [totalHours, setTotalHours] = useState('--:--');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        console.log('Check in Today.');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.name || userNameFromSignup);
        if (data.imageUrl) {
          setUserImage(data.imageUrl);
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format('h:mm a'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateTotalHours = () => {
      if (checkInTime && checkOutTime) {
        const checkInMoment = moment(checkInTime, 'h:mm a');
        const checkOutMoment = moment(checkOutTime, 'h:mm a');
        const diffInHours = checkOutMoment.diff(checkInMoment, 'hours', true);
        setTotalHours(diffInHours.toFixed(2));
      }
    };

    calculateTotalHours();
  }, [checkInTime, checkOutTime]);

  const handleBiometricAction = async () => {
    try {
      // Implement biometric authentication logic
      const isFirstTime = !checkInTime;

      if (isFirstTime) {
        const currentTime = moment().format('h:mm a');
        setCheckInTime(currentTime);
        localStorage.setItem('checkInTime', currentTime);
      } else if (!checkOutTime) {
        const currentTime = moment().format('h:mm a');
        setCheckOutTime(currentTime);
        localStorage.setItem('checkOutTime', currentTime);
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
    }
  };

  
  return (
    <div className="card-body">
      <span><BackButton style={{ color: '#4A82DD' }} /></span>
      <div className="card-inner">
       <Header />

        <div className="time-display">
          <h1>{time}</h1>
          <p>{date}</p>
        </div>

        <div className="checkin-section">
          <div className="biometric-action" onClick={handleBiometricAction} style={{ cursor: 'pointer' }}>
          {checkInTime ? <img src={BiometricIconOut} alt="Biometric Icon" style={{ width: '120px', height: '120px' }} /> :
          <img src={BiometricIcon} alt="Biometric Icon" style={{ width: '120px', height: '120px' }} /> }
            <h3 style={{textAlign: "center"}}>{checkInTime ? <span style={{ color: '#E35B5B' }}>Check Out</span> : <span style={{ color: '#55B841' }}>Check In</span>}</h3>
          </div>
        </div>

        <div className="status-section">
          <div>
            <span><img src={checkIn} alt="Check In" style={{ width: '33px' }} /></span>
            <h2>{checkInTime || '--:--'}</h2>
            <p>Check In</p>
          </div>

          <div>
            <span><img src={checkOut} alt="Check Out" style={{ width: '28px' }} /></span>
            <h2>{checkOutTime || '--:--'}</h2>
            <p>Check Out</p>
          </div>

          <div>
            <span><img src={Hrs} alt="Hours Worked" style={{ width: '33px' }} /></span>
            <h2>{totalHours} hrs</h2>
            <p>Total Hrs</p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CheckInOutBiometric;
