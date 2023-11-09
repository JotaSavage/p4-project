import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const userData = {
      username,
      password,
    };

    fetch('http://127.0.0.1:5555/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData),
  credentials: 'include' // This tells the browser to send cookies along with the request
})
.then((response) => {
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
})
.then((data) => {
  setAuth(true);
  navigate('/data'); // Navigate to the data page on successful login
})
.catch((error) => {
  console.error('Error during login:', error);
  setError('Login failed. Please check your credentials.');
});
  };
  

  const handleSignupRedirect = () => {
    navigate('/signup');
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
