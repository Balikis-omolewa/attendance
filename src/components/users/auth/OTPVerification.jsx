import React, { useState } from 'react';
import axios from 'axios';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/attendance_system/verify_otp.php', { otp });
      if (response.data.success) {
        alert('OTP verified successfully!');
        // Redirect to the desired page
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError('An error occurred during verification. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Verify Your Phone Number</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default OTPVerification;
