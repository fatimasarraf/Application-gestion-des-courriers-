import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import logo from './lg.png';
import userIcon from './icon.png';
import Alert from './Alert';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.endsWith('@ucd.ac.ma')) {
      setError("L'email doit se terminer par @ucd.ac.ma");
      return;
    }

    try {
      console.log('Attempting to login with:', { email, password }); // Debug message
      const response = await axios.post('http://127.0.0.1:8000/api/Courrier/login/', {
        email,
        password,
      });
      console.log('Response from API:', response.data); // Debug message to show the API response

      if (response.status === 200) {
        const { access, refresh, user_id, username, fonction, role } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_id', user_id);  // Stocker l'ID utilisateur dans le local storage
        console.log(`User ID: ${user_id}`);

        localStorage.setItem('username', username);  // Stocker le nom d'utilisateur dans le local storage
        console.log(`Username: ${username}`);

        localStorage.setItem('fonction', fonction);  // Stocker la fonction dans le local storage
        console.log(`Fonction: ${fonction}`);

        localStorage.setItem('role', role);
        console.log(`Role: ${role}`);

        setSuccess('Connexion réussie');
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError('Identifiants invalides. Veuillez vérifier vos informations et réessayer.');
      }
    } catch (error) {
      console.error('Error during login:', error); // Debug message to show the error
      setError('Identifiants invalides. Veuillez vérifier vos informations et réessayer.');
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <img src={logo} alt="Logo" className="logo" />
        <img src={userIcon} alt="User" className="input-icon" />
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Connexion</button>
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />
        </form>
      </div>
      <div className="image-container">
        <img src={require('./imagedeGO.png')} alt="Presidency" />
      </div>
    </div>
  );
}

export default Login;
