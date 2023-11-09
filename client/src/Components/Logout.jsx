import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/logout', {
        method: 'DELETE',
        credentials: 'include' // if you're handling sessions with cookies
      });
      
      // We should only try to parse the response body if the request was successful
      if (response.ok) {
        // Optional: Validate JSON response if your server always returns JSON
        const data = await response.json(); // Only if the server responds with JSON

        // Assuming setAuth is a function to update the auth state
        setAuth(false);
        navigate('/login');
      } else {
        // Handle HTTP errors
        console.error('Logout failed: ', response.status, response.statusText);
        // Parse and throw the server's error message if it's in JSON format
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }
    } catch (error) {
      // Handle network errors or exceptions thrown from response processing
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={{ textAlign: 'right' }}>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
