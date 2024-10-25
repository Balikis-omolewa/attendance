import { useState } from "react";
// import {supabase} from '../../supabase/supabase.js'; 
import '../../admin/account/AddLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Added name field
  const [isRegistering, setIsRegistering] = useState(false); // For toggling between login and sign up
  const [errorMessage, setErrorMessage] = useState("");

  // Sign in existing user
  const handleSignIn = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  // Sign up new user with name, email, and password
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      // Store additional user information in Supabase
      const { error: insertError } = await supabase
        .from('admins')
        .insert([{ email, name }]);

      if (insertError) {
        setErrorMessage(insertError.message);
      } else {
        window.location.href = "/admin/dashboard";
      }
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={isRegistering ? handleSignUp : handleSignIn}>
        <h2>{isRegistering ? "Admin Sign Up" : "Admin Login"}</h2>

        {isRegistering && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? "Sign Up" : "Sign In"}</button>
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Toggle between sign in and sign up */}
        <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: 'pointer', color: 'blue', textAlign: 'center', marginTop: '10px' }}>
          {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
