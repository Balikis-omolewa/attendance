import { useState, useEffect } from 'react';
import moment from 'moment';
import { CiLock } from "react-icons/ci";
import checkIn from '../../../assets/img/in.png';
import checkOut from '../../../assets/img/out.png';
import Hrs from '../../../assets/img/hrs.png';
import avatar from '../../../assets/img/avatar.png';
import { IoIosCheckmarkCircle } from "react-icons/io";
import BackButton from '../BackButton';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLocation } from 'react-router-dom';

const CheckInOutPassword = () => {
  const location = useLocation();
  const userNameFromSignup = location.state?.name || '';

  const [time, setTime] = useState(moment().format('h:mm a'));
  const [date, setDate] = useState(moment().format('MMMM Do, YYYY'));
  const [checkInTime, setCheckInTime] = useState(localStorage.getItem('checkInTime') || null);
  const [checkOutTime, setCheckOutTime] = useState(localStorage.getItem('checkOutTime') || null);
  const [totalHours, setTotalHours] = useState('--:--');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [greetUser, setGreetUser] = useState(null);
  const [userName, setUserName] = useState(userNameFromSignup);
  const defaultPassword = '1234'; // Default password for testing

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format('h:mm a'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const users = auth.currentUser;
      if (users) {
        const docRef = doc(db, "users", users.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || userNameFromSignup);
          if (data.password) {
            // Uncomment the next line if you plan to use dynamic passwords
            // setStoredPassword(data.password || defaultPassword);
            setStoredPassword(defaultPassword); // Hardcoded password
          } else {
            setStoredPassword(defaultPassword); // Hardcoded password
          }
          if (data.imageUrl) {
            setUserImage(data.imageUrl);
          }
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [userNameFromSignup]);

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const user = auth.currentUser;
      if (user) {
        const storage = getStorage();
        const storageRef = ref(storage, `user-images/${user.uid}/${file.name}`);

        try {
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          setUserImage(imageUrl);

          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { imageUrl });

          console.log('Image uploaded and user document updated with image URL');
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Check console for details.');
        }
      }
    }
  };

  const handleGreetUser = () => {
    const currentHour = moment().hour();
    let greeting = '';

    if (currentHour < 12) {
      greeting = 'Morning';
    } else if (currentHour < 18) {
      greeting = 'Afternoon';
    } else {
      greeting = 'Evening';
    }
    setGreetUser(greeting);
  };

  useEffect(() => {
    handleGreetUser();
  }, []);

  const handleAction = async () => {
    const inputPassword = password.trim();
    const storedPasswordTrimmed = storedPassword.trim();

    if (inputPassword === storedPasswordTrimmed) {
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
      } else {
        setErrorMessage('You have already checked out.');
      }
      setPassword('');
    } else {
      setErrorMessage('Incorrect password. Try again.');
    }
  };

  return (
    <div className="card-body">
      <span><BackButton style={{ color: '#4A82DD' }} /></span>
      <div className="card-inner">
        <div className="heading">
          <div className="greeting">
            <h2>Hey {userName || 'User'}!</h2>
            <p>Good {greetUser}! {checkInTime ? 'Remember to Check Out.' : 'Check In Today.'}</p>
          </div>
          <div className="profile-picture">
            <label htmlFor="file-upload">
              {userImage ? (
                <img src={userImage} alt="Profile" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <img src={avatar} alt="Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', cursor: 'pointer' }} />
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
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
            <span><img src={checkIn} style={{ width: '33px' }} alt="CheckIn" /></span>
            <h2>{checkInTime || '--:--'}</h2>
            <p>Check In</p>
          </div>
          <div>
            <span><img src={checkOut} style={{ width: '28px' }} alt="CheckOut" /></span>
            <h2>{checkOutTime || '--:--'}</h2>
            <p>Check Out</p>
          </div>
          <div>
            <span><img src={Hrs} style={{ width: '33px' }} alt="Hrs" /></span>
            <h2>{totalHours || '--:--'}</h2>
            <p>Total Hrs</p>
          </div>
        </div>

        <div className="footer-nav check-card">
          <button>Home</button>
          <button>History</button>
          <button>Profile</button>
        </div>
      </div>
    </div>
  );
};

export default CheckInOutPassword;
