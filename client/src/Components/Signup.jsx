import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (username, password) => {
    return fetch('http://127.0.0.1:5555/signup', { // Your backend API endpoint for signup
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      return response.json();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Clear any existing errors

    handleSignup(username, password)
      .then(() => {
        navigate('/data'); // Redirect to the articles page or another page of your choice
      })
      .catch((error) => {
        setError(error.message || 'An error occurred. Please try again.');
      });
  };

  return (
    <div className="Signup">
      <h2>Signup</h2>
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
