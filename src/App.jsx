import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './components/users/welcomePage/SplashScreen';
import SignUp from './components/users/auth/SignUp';
import SignIn from './components/users/auth/SignIn';
import VerifyEmail from './components/users/auth/VerifyAccount';
import LocationAccess from './components/users/auth/location/LocationAccess';
import CheckInOutPassword from './components/users/checkInCheckOut/CheckInCheckOutWithPassword';
import CheckWithBiometric from './components/users/checkInCheckOut/CheckInCheckOutBiometric';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verifyaccount" element={<VerifyEmail />} />
        <Route path="/location-access" element={<LocationAccess />} />
         <Route path="/checkwithpassword" element={<CheckInOutPassword />} />
        <Route path="/checkinwithbiometric" element={<CheckWithBiometric />} />
        
      </Routes>
    </Router>
  );
}

export default App;
