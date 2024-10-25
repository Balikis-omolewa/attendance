import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../../../assets/img/w-logo.png';
import location from '../../../../assets/img/location.png';
import Modal from 'react-modal';
import BackButton from '../../BackButton';
import axios from 'axios';

function LocationAccess() {
    const [adminLocations, setAdminLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [locationAllowed, setLocationAllowed] = useState(false);
    const [locationName, setLocationName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminLocations = async () => {
            try {
                const response = await axios.get('http://localhost/attendance_system/location_created.php');
                if (response.data) {
                    setAdminLocations(response.data);
                } else {
                    console.error("No data received");
                }
            } catch (error) {
                console.error("Error fetching admin locations:", error);
            }
        };

        fetchAdminLocations();
    }, []);

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleAllowLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoading(true);
    
                    // Log the user's location
                    console.log("User's Location:", { latitude, longitude });
    
                    try {
                        // Send location data to the PHP script
                        const response = await axios.post('http://localhost/attendance_system/user_locations.php', {
                            latitude,
                            longitude
                        });
    
                        // Check if the response indicates success
                        if (response.data.success) {
                            console.log(response.data.message);
                        } else {
                            console.error(response.data.message);
                        }
                    } catch (error) {
                        console.error("Error saving location:", error);
                    }
    
                    // Assuming location capture was successful
                    setLocationAllowed(true);
                    setLocationName("captured");
                    setModalIsOpen(true);
    
                    // Navigate to the Check-In/Check-Out page after a delay
                    setTimeout(() => {
                        navigate('/signin');
                    }, 5000);
    
                    setLoading(false);
                },
                (error) => {
                    alert("Please allow location access to proceed.");
                    setLoading(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };
    
    
    return (
        <div className="card-body">
            <div className="header">
                <span><BackButton /></span>
                <p style={{textAlign: "center", display: "flex", justifyContent: "center"}}><img src={logo} alt="Logo" className="app-logo" /></p>
            </div>
            <div className="card-content card-content-bottom">
                <div className="mini-card">
                <div 
         style={{display: "flex", justifyContent: "center"}}>
                        <img src={location} alt="Location Icon" className="location-img" />
                    </div>
                    <h4 style={styles.enable}>ENABLE LOCATION</h4>
                    <p style={styles.text}>
                        Please enable location services to ensure accurate attendance tracking. 
                        This helps us verify your presence and provides a smoother experience with the app.
                    </p><br />
                    <button onClick={handleAllowLocation} className="check-card" style={{ padding: "15px" }} disabled={loading}>
                        {loading ? "Loading..." : "ALLOW WHILE USING APP"}
                    </button>
                    <button onClick={() => alert("You have chosen not to allow location access")} className="check-card" style={styles.secondaryButton}>
                        DON'T ALLOW
                    </button>
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
                <span onClick={closeModal} style={modalStyles.close}>X</span>
                <div style={modalStyles.card}>
                    <h2>{locationAllowed ? 'Location Access Granted:' : 'Access Denied'}</h2>
                    <p>{locationAllowed ? `Your current location has been successfully ${locationName}.` : "Please enable location access to continue using the app."}</p>
                    <button onClick={closeModal} style={modalStyles.button}>OK</button>
                </div>
            </Modal>
        </div>
    );
}

// Modal styles
const modalStyles = {
    content: {
        top: '55%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        borderRadius: '12px',
        width: '80%',
        maxWidth: '400px',
        textAlign: 'center',
        zIndex: '10000',
        position: 'fixed',
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    overlay: {
        zIndex: '10000',
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    card: { 
        marginBottom: '50px',
        marginTop: '60px',
    },
    close: {
        padding: '10px',
        color: '#0b0b0b',
        fontSize: '20px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        float: 'right',
    },
    button: {
        width: '80%',
        padding: '15px',
        backgroundColor: '#4A82DD',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px'
    },
};

const styles = {
    enable: {
        color: "#4A82DD",
        fontSize: "20px",
        marginTop: "20px",
        fontWeight: "500",
    },
    text: {
        color: "#7d7d7d",
        fontSize: "14px",
    },
    secondaryButton: {
        backgroundColor: "#fff",
        color: "#4A82DD",
        padding: "15px",
    },
};

export default LocationAccess;
