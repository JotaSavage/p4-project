import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook to navigate to different routes

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Clear any existing errors
    // TODO: Implement backend login logic here
    onLogin(username, password, setError);
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="Login">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <button type="button" onClick={handleSignupRedirect}>Signup</button>
      </form>
    </div>
  );
}

export default Login;
