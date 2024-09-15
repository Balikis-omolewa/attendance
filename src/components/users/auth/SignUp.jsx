import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../shared/style.css'; 
import logo from '../../../assets/img/w-logo.png';
import * as firebaseConfig from '../../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Modal, Button } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { IoIosArrowBack, IoIosCar} from "react-icons/io";
import { FaRegUser, FaLongArrowAltLeft, FaRegIdCard  } from "react-icons/fa";
import { MdOutlineMailOutline, MdOutlineLaptopChromebook, MdLockOutline } from "react-icons/md";
import { FaDiscourse } from "react-icons/fa6";
import { SiUnlicense } from "react-icons/si";
import { IoLocationOutline } from "react-icons/io5";
import { PiCityLight } from "react-icons/pi";
import { FcDepartment } from "react-icons/fc";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Student');
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
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const navigate = useNavigate(); 

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhoneChange = (phone) => {
    setFormData({
      ...formData,
      phone: phone || '' // Ensure phone number is updated to an empty string if `null`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form Data: ", formData);

      // Check if the user already exists
      const userQuery = query(collection(firebaseConfig.db, "users"), where("email", "==", formData.email));
      const querySnapshot = await getDocs(userQuery);
      
      console.log("Query Snapshot: ", querySnapshot);

      if (!querySnapshot.empty) {
        alert('An account with this email already exists.');
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(firebaseConfig.auth, formData.email, formData.password);
      console.log("User created: ", userCredential);

      // Send verification email
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent.");

      // Add user data to Firestore
      const docRef = await addDoc(collection(firebaseConfig.db, "users"), {
        ...formData,
        role: role,
        createdAt: new Date(),
      });
      console.log("User data added to Firestore: ", docRef);

      setShowSuccessModal(true);
    } catch (error) {
        console.error("Error during registration:", error); // Log the full error to the console for debugging

        // Show error message weak action
        if (error.code === 'auth/email-already-in-use') {
            alert('The email address is already in use by another account.');
        } else if (error.code === 'auth/invalid-email') {
            alert('The email address is not valid.');
        } else if (error.code === 'auth/weak-password') {
            alert('The password is too weak. At least 8 characters');
        } else {
            alert('An error occurred during registration. Please try again later.');
        }
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.name && formData.email && formData.phone && formData.password) {
      setStep(2);
    } else {
      alert("Please fill in all the required fields.");
    }
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


  return (
    <div className="card-body">
      <div className='header'>
        <span className="back-arrow" onClick={handleBack}>
          <IoIosArrowBack />
        </span>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className='card-content'>
        <select className='users' value={role} onChange={handleRoleChange}>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
          <option value="Visitor">Visitor</option>
        </select> 
        <div className='content-info'>
          <h2>Create an Account</h2>
          <p>Welcome! Register your account to get started</p>
        </div>
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
                  {/* <FiPhone className='icon' style={{ fontSize: "1.4rem"}} /> */}
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
                    required
                  />
                </div>
              </div>
              <button type="button" className='action-btn' onClick={handleNext}>Continue</button>
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
                  <div style={{ textAlign: "left", cursor: "pointer", fontSize: "14px"}} onClick={handleBack}>
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
                  <div style={{ textAlign: "left", cursor: "pointer", fontSize: "14px"}} onClick={handleBack}>
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
                  <div style={{ textAlign: "left", cursor: "pointer", fontSize: "14px"}} onClick={handleBack}>
                 <FaLongArrowAltLeft /> Go Back
              </div>
                </>
              )}
              <button type="submit" className='action-btn'>Submit</button>
            </>
          )}
        </form>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseModal} centered className='mt-5'>
        <Modal.Header closeButton style={{ borderBottom: 'none' }}></Modal.Header>
        <Modal.Title className='text-center mt-2' style={{fontWeight: "500"}}>Success!</Modal.Title>
        <Modal.Body>
          <p className='text-center'>Your account has been successfully created! Please click on the link sent to your email to verify account.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', marginBottom: '20px' }}>
          <Button variant="primary" className='w-100 mt-3 p-2 text-light font-20' onClick={handleCloseModal}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUp;
