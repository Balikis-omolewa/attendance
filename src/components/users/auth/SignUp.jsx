import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaRegUser, FaRegIdCard, FaLongArrowAltLeft } from "react-icons/fa";
import { MdOutlineMailOutline, MdLockOutline, MdOutlineLaptopChromebook  } from "react-icons/md";
import logo from '../../../assets/img/w-logo.png';
import '../../shared/style.css';
import { IoIosArrowBack, IoIosCar} from "react-icons/io";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaDiscourse } from "react-icons/fa6";
import { SiUnlicense } from "react-icons/si";
import { IoLocationOutline } from "react-icons/io5";
import { PiCityLight } from "react-icons/pi";
import { FcDepartment } from "react-icons/fc";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Student');
  const [UserErrorPass, setUserErrorPass] = useState("");
  const [loading, setLoading] = useState(false); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    fieldOfStudy: '',
    laptopModel: '',
    carModel: '',
    licensePlateNumber: '',
    staffID: '',
    department: '',
    address: '',
    city: '',
    role: role,
  });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User Data:", { ...formData, role });
    setLoading(true); 
  
    try {
      const sanitizedFormData = { ...formData, role };
      if (!sanitizedFormData.carModel) delete sanitizedFormData.carModel;
      if (!sanitizedFormData.licensePlateNumber) delete sanitizedFormData.licensePlateNumber;
  
      const response = await axios.post('http://localhost/attendance_system/signup.php', sanitizedFormData);
      console.log("Response from backend:", response.data);
  
      if (response.data.success) {
        // Wait for SweetAlert2 to be confirmed before redirecting
        await MySwal.fire({
          title: 'Success!',
          text: 'Your registration was successful! please check your email for verification link.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            // navigate('/verifyaccount');  
          }
        });
      } else if (response.data.error) {
        // SweetAlert for error
        MySwal.fire({
          title: 'Error!',
          text: response.data.error,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      MySwal.fire({
        title: 'Error!',
        text: 'An error occurred during registration. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false); 
    }
  };
  
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setStep(1);
    setFormData({
      ...formData,
      role: e.target.value,
      fieldOfStudy: '',
      department: '',
      carModel: '',
      licensePlateNumber: ''
    });
  };

  const handlePhoneChange = (phone) => {
    setFormData({
      ...formData,
      phone: phone || '' 
    });
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/verifyaccount');
  };

  const checkPassword = () => {
    if (formData.password.length < 6) {
      setUserErrorPass("Password is less than 6 characters!");
    } else {
      setUserErrorPass("");
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.name && formData.email && formData.phone && formData.password.length >= 6) {
      setStep(2);
    } else {
      alert("Please fill in all the required fields with valid information.");
    }
  };

  return (
    <div className="card-body">
      <div className='header'>
        <span className="back-arrow" onClick={handleBack}>
          <IoIosArrowBack />
        </span>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className='card-content'>
        <div className='content-info'>
          <h2>Create an Account</h2>
          <p>Welcome! Register your account to get started</p>
        </div>
        <select className='users' value={role} onChange={handleRoleChange}>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
          <option value="Visitor">Visitor</option>
        </select> 
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-group">
                <div className="form-field">
                  <FaRegUser className='icon' />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder='Input Name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-field">
                  <MdOutlineMailOutline className='icon' style={{ fontSize: "1.4rem"}} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder='Email Address'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-field">
                   <PhoneInput
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultCountry="NG"
                    placeholder='Phone Number'
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-field">
                  <MdLockOutline className='icon' style={{ fontSize: "1.4rem"}} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={checkPassword}
                    required
                  />
                </div>
              </div>
              {UserErrorPass && <p className="error-message">{UserErrorPass}</p>}
              <button type="button" className='action-btn' onClick={handleNext} disabled={loading}>
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </>
          )}
          
          {step === 2 && (
            <>
              {role === 'Student' && (
                <>
                <div className="form-group">
                  <div className="form-field">
                  <FaDiscourse className='icon' />
                  <input
                    type="text"
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    placeholder='Field of Study'
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    required
                  />
                  </div>
                </div>
                <div className="form-group">
                <div className="form-field">
                  <MdOutlineLaptopChromebook className='icon' style={{ fontSize: "1.4rem"}} />
                  <input
                    type="text"
                    id="laptopModel"
                    name="laptopModel"
                    placeholder='Laptop Model'
                    value={formData.laptopModel}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-field">
                  <IoIosCar className='icon' style={{ fontSize: "1.5rem"}} />
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    placeholder='Car Model (optional)'
                    value={formData.carModel}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-field">
                  <SiUnlicense className='icon' style={{ fontSize: "1.4rem"}} />
                  <input
                    type="text"
                    id="licensePlateNumber"
                    name="licensePlateNumber"
                    placeholder='License Plate Number (optional)'
                    value={formData.licensePlateNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div style={{ textAlign: "left", cursor: "pointer", fontSize: "14px", display: "flex", justifyContent: 'flex-start', alignItems: "center"}} onClick={handleBack}>
                <FaLongArrowAltLeft /> Go Back
              </div>
            </>
              )}
              {role === 'Staff' && (
                <>
                <div className="form-group">
                    <div className="form-field">
                      <FaRegIdCard className='icon' style={{ fontSize: "1.4rem"}} />
                      <input
                        type="text"
                        id="staffID"
                        name="staffID"
                        placeholder='Staff ID'
                        value={formData.staffID}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                  <div className="form-field">
                  <FcDepartment className='icon' style={{ fontSize: "1.4rem"}} />
                    <input
                      type="text"
                      id="department"
                      name="department"
                      placeholder='Department'
                      value={formData.department}
                      onChange={handleChange}
                      required
                    />
                    </div>
                  </div>
                  <div className="form-group">
                  <div className="form-field">
                  <IoLocationOutline className='icon' style={{ fontSize: "1.4rem"}} />
                    <input
                      type="text"
                      id="carModel"
                      name="carModel"
                      placeholder='Car Model (Optional)'
                      value={formData.carModel}
                      onChange={handleChange}
                    />
                    </div>
                  </div>
                  <div className="form-group">
                  <div className="form-field">
                  <PiCityLight className='icon' style={{ fontSize: "1.4rem"}} />
                    <input
                      type="text"
                      id="licensePlateNumber"
                      name="licensePlateNumber"
                      placeholder='License Plate Number (Optional)'
                      value={formData.licensePlateNumber}
                      onChange={handleChange}
                    />
                    </div>
                  </div>
                  <div style={{ textAlign: "left", cursor: "pointer", fontSize: "14px", display: "flex", justifyContent: 'flex-start', alignItems: "center"}} onClick={handleBack}>
                <FaLongArrowAltLeft /> Go Back
             </div>
                </>
              )}
              {role === 'Visitor' && (
                <>
                <div className="form-group">
                  <div className="form-field">
                  <IoLocationOutline className='icon' style={{ fontSize: "1.4rem"}} />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder='Address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  </div>
                </div>
                <div className="form-group">
                <div className="form-field">
                  <PiCityLight className='icon' style={{ fontSize: "1.4rem"}} />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder='City'
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-field">
                  <IoIosCar className='icon' style={{ fontSize: "1.5rem"}} />
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    placeholder='Car Model (optional)'
                    value={formData.carModel}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-field">
                  <SiUnlicense className='icon' style={{ fontSize: "1.4rem"}} />
                  <input
                    type="text"
                    id="licensePlateNumber"
                    name="licensePlateNumber"
                    placeholder='License Plate Number (optional)'
                    value={formData.licensePlateNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div style={{ textAlign: "left", cursor: "pointer", fontSize: "14px", display: "flex", justifyContent: 'flex-start', alignItems: "center"}} onClick={handleBack}>
                <FaLongArrowAltLeft /> Go Back
             </div>
               </>
              )}
              <button type="submit" className='action-btn' disabled={loading}>
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
