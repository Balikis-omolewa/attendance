import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../shared/style.css';
import logo from '../../../assets/img/w-logo.png';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineMailOutline } from 'react-icons/md';
import BackButton from '../BackButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Call your PHP endpoint to handle the password reset
      const response = await fetch('/path/to/resetPassword.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setErrorMessage(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/signin'); // Redirect to sign-in page after resetting
  };

  return (
    <div className="card-body">
      <BackButton />
      <div className='header'>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className='card-content'>
        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-field">
              <MdOutlineMailOutline className='icon' style={{ fontSize: "1.4rem"}} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder='Email Address'
                value={email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <button type="submit" className='action-btn' disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseModal} centered className='mt-2'>
        <Modal.Header closeButton style={{ borderBottom: 'none' }}></Modal.Header>
        <Modal.Title className='text-center mt-2' style={{ fontWeight: "500" }}>Success!</Modal.Title>
        <Modal.Body>
          <p className='text-center'>
            A password reset link has been sent to your email. Please check your inbox.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', marginBottom: '20px' }}>
          <Button variant="primary" className='w-100 mt-3 p-2 text-light font-20' onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
