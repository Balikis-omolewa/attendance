import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './components/users/welcomePage/SplashScreen';
import SignUp from './components/users/auth/SignUp';
import SignIn from './components/users/auth/SignIn';
import VerifyEmail from './components/users/auth/VerifyAccount';
import LocationAccess from './components/users/auth/location/LocationAccess';
import CheckInOutPassword from './components/users/checkInCheckOut/CheckInCheckOutWithPassword';
import CheckWithBiometric from './components/users/checkInCheckOut/CheckInCheckOutBiometric';


// import Admin Dashboard Components
import AdminLogin from './components/admin/account/AddLogin';
import ProfilePage from './components/users/Profile';
import ForgotPassword from './components/users/auth/Forgot-password';
import OTPVerification from './components/users/auth/OTPVerification';
import Dashboard from './components/admin/dashboard/Dashboard';
import UserProfile from './components/users/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verifyotp" element={<OTPVerification />} />
        <Route path="/verifyaccount" element={<VerifyEmail />} />
        <Route path="/location-access" element={<LocationAccess />} />
         <Route path="/checkwithpassword" element={<CheckInOutPassword />} />
        <Route path="/checkinwithbiometric" element={<CheckWithBiometric />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/userprofile" element={<UserProfile/>} />
        
         {/* // Admin Dashboard Route */}
         <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
