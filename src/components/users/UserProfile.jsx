import { useState, useEffect } from 'react';
import BackButton from './BackButton';
import logo from '../../../src/assets/img/w-logo.png';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null); // State to store user details
  const [error, setError] = useState(''); // State to handle errors

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost/attendance_system/each_user_profile.php?s_n=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        if (data.success) {
          setUser(data.user); // Store user data in state
        } else {
          setError(data.error); // Handle errors from the backend
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>; // Display error message
  }

  if (!user) {
    return <p>Loading...</p>; // Show loading while fetching data
  }

  // Render user profile details
  return (
    <div className="card-body">
      <BackButton />
      <div className='header'>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className='card-content'>
        <div className="user-profile">
          <h1>{user.name}'s Profile</h1>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
          <p><strong>Role:</strong> {user.role || "N/A"}</p>
          {/* Display other fields like address, department, etc., if available */}
          <p><strong>Address:</strong> {user.address || "N/A"}</p>
          <p><strong>City:</strong> {user.city || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
