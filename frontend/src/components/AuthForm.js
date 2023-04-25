import React, { useState } from 'react';
import { login, register } from '../utils/api';

function AuthForm({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onAuth();
    } catch (error) {
      console.error(isLogin ? 'Login failed' : 'Register failed');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      <button type="button" onClick={toggleForm}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </form>
  );
}

export default AuthForm;
