import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/w-logo.png';
import { IoIosArrowBack } from "react-icons/io";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(window.location.search).get('token'); // Get the token from the URL
      console.log("Verification token from URL:", token); // Log the token for debugging

      if (!token) {
        setError('No verification token provided.');
        return;
      }

      try {
        const response = await fetch('http://localhost/attendance_system/verifyaccount.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }), // Send the token to the server
        });
        
        const text = await response.text(); // Get the response as text
        console.log("Raw response from server:", text); // Log the raw response
        const data = JSON.parse(text); // Now parse it to JSON

        if (data.success) {
          setIsVerified(true);
          setVerificationStatus('Email Verified! Redirecting...');
          setTimeout(() => {
            navigate('/location-access'); // Redirect to desired page after verification
          }, 2000); // Wait for 2 seconds before redirecting
        } else {
          setVerificationStatus('Verification failed.');
          setError(data.error || 'Verification failed.');
        }
      } catch (err) {
        console.error('Failed to verify email:', err); // Log error if fetch fails
        setError('Failed to verify email.');
      }
    };

    verifyEmail();
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="card-body">
      <div className="header">
        <span className="back-arrow" onClick={handleBack}>
          <IoIosArrowBack />
        </span>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className="card-content" style={{ height: "50vh" }}>
        <div className='content-info'>
          <h2>VERIFICATION STATUS</h2>
        </div>
        <div className="form-field mt-5 center">
          <input type="text" className='input text-center' style={{ color: 'green' }} readOnly value={verificationStatus} />
        </div>
        {error && <p style={{ color: '#333' }}>{error}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
