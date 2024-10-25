import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import avatar from '../../../assets/img/avatar.png';
import moment from 'moment'; // Import moment for time handling
import { auth, db } from '../../firebase/firebaseConfig'; // Import firebase config
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Header = ({ userNameFromSignup, checkInTime }) => { // Pass userNameFromSignup and checkInTime as props
  const [userImage, setUserImage] = useState(null); // User image state
  const [greetUser, setGreetUser] = useState('');
  const [userName, setUserName] = useState(userNameFromSignup); // Set initial username
  const [imageUploadError, setImageUploadError] = useState('');

  // Greet user based on time of day
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

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageUploadError('No file selected.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const storage = getStorage();
      const storageRef = ref(storage, `user-images/${user.uid}/${file.name}`);

      try {
        // Upload the image to Firebase Storage
        await uploadBytes(storageRef, file);
        console.log('Image successfully uploaded.');

        // Get the download URL for the uploaded image
        const imageUrl = await getDownloadURL(storageRef);
        setUserImage(imageUrl); // Set the uploaded image URL in the state

        // Update the user document in Firestore with the new image URL
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { imageUrl });

        console.log('User document updated with new image URL.');
        setImageUploadError('');
      } catch (error) {
        console.error('Error uploading image:', error);
        setImageUploadError('Failed to upload image. Please try again.');
      }
    } else {
      setImageUploadError('User is not authenticated.');
    }
  };

  return (
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
        {imageUploadError && <p style={{ color: 'red' }}>{imageUploadError}</p>}
      </div>
    </div>
  );
};

export default Header;
