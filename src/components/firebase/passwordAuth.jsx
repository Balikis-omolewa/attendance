import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Firebase configuration

const PasswordAuth = () => {
  const [usersData, setUsersData] = useState([]); // Holds user data from Firestore

  // Fetch users data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const colRef = collection(db, 'users'); // Reference to the 'users' collection
        const snapshot = await getDocs(colRef); // Fetch all documents
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
          console.log("data", users); // Map doc data and doc id to the array
        });
        setUsersData(users); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching user data:", error.message); // Handle errors
      }
    };

    fetchUsers(); // Invoke the function
  }, []); // Empty dependency array to run only on component mount

  return (
    <div>
      <h3>Users Data</h3>
      {/* Conditional rendering to display user data or message if no data found */}
      {usersData.length > 0 ? (
        usersData.map((user) => (
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default PasswordAuth;
