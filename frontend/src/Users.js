/* import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css';
import Alert from './Alert'; // Import the Alert component
import {useNavigate } from 'react-router-dom';
export default function Users() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'Utilisateur',
    department: '',
    service: '',
    pole: '',
    fonction: ''
  });

  const [services, setServices] = useState([]);
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' }); // State to hold alert message and type

  useEffect(() => {
    // Fetch services data from the backend
    axios.get('http://127.0.0.1:8000/api/Courrier/services/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the services!', error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMessage({ message: '', type: '' }); // Clear any existing alert message

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@ucd\.ac\.ma$/;
    if (!emailPattern.test(formData.email)) {
      setAlertMessage({ message: 'Email must be in the format: @ucd.ac.ma', type: 'error' });
      return;
    }

    axios.post('http://127.0.0.1:8000/api/Courrier/add_users/', formData)
      .then(response => {
        console.log(response.data);
        setAlertMessage({ message: 'User added successfully!', type: 'success' });
        navigate('/AllUsers');
        setFormData({
          username: '',
          password: '',
          email: '',
          role: 'Utilisateur',
          department: '',
          service: '',
          pole: '',
          fonction: ''
        });
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          if (error.response.data.error === 'User already exists') {
            setAlertMessage({ message: 'User already exists!', type: 'error' });
          } else {
            setAlertMessage({ message: error.response.data.error, type: 'error' });
          }
        } else {
          setAlertMessage({ message: 'There was an error adding the user!', type: 'error' });
        }
        console.error('There was an error adding the user!', error);
      });
  };

  

  return (
    <div className="user-form-container-utilisateur" >
    <h2 className="dashboard-title-user">Ajouter un Utilisateur</h2>
    {alertMessage.message && <Alert message={alertMessage.message} type={alertMessage.type} />}
    <div className="form-scroll-utilisateur">
      <form onSubmit={handleSubmit}className="form-utilisateur" >
        <div className="form-group-utilisateur">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group-utilisateur">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group-utilisateur">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group-utilisateur">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="Admin">Admin</option>
            <option value="Utilisateur">Utilisateur</option>
            <option value="chef">Chef</option>
            <option value="chefservice">Chef Service</option>
          </select>
        </div>
        <div className="form-group-utilisateur">
          <label>Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </div>
        <div className="form-group-utilisateur">
          <label>Service</label>
          <select name="service" value={formData.service} onChange={handleChange} required>
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.service_id} value={service.service_id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group-utilisateur">
          <label>Pole</label>
          <input type="text" name="pole" value={formData.pole} onChange={handleChange} />
        </div>
        <div className="form-group-utilisateur">
          <label>Fonction</label>
          <input type="text" name="fonction" value={formData.fonction} onChange={handleChange} />
        </div>
        <button type="submit" className="utilisateur-Boutton">Ajouter Utilisateur</button>
      </form>
    </div>
  </div>
);
} */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css';
import Alert from './Alert'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Users() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'Utilisateur',
    department: '',
    service: '',
    pole: '',
    fonction: ''
  });

  const [services, setServices] = useState([]);
  const [poles, setPoles] = useState([]);
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
  const [invalidFields, setInvalidFields] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    

      axios.get('http://127.0.0.1:8000/api/Courrier/poles/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setPoles(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the services!', error);
      });

      axios.get('http://127.0.0.1:8000/api/Courrier/services/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the services!', error);
      });


      axios.get('http://127.0.0.1:8000/api/Courrier/divisions/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setDivisions(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the services!', error);
      });
      
      
    
      

      axios.get('http://127.0.0.1:8000/api/Courrier/roles/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the roles!', error);
      }); 

      
  }, []);

  

  


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setInvalidFields(invalidFields.filter(field => field !== e.target.name));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMessage({ message: '', type: '' });
    setErrorMessage('');

    
    const requiredFields = ['username', 'password', 'email', 'role', 'department', 'fonction'];

    const invalidFields = requiredFields.filter(field => !formData[field].trim());

    const emailPattern = /^[a-zA-Z0-9._%+-]+@ucd\.ac\.ma$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      setErrorMessage('Email must be in the format: @ucd.ac.ma');
      invalidFields.push('email');
    }

    if (invalidFields.length > 0) {
      setInvalidFields(invalidFields);
      setErrorMessage('Veuillez remplir tous les champs.');
     
      return;
    }

    axios.post('http://127.0.0.1:8000/api/Courrier/add_users/', formData)
      .then(response => {
        console.log(response.data);
        setAlertMessage({ message: 'User added successfully!', type: 'success' });
        navigate('/AllUsers');
        setFormData({
          username: '',
          password: '',
          email: '',
          role: 'Utilisateur',
          department: '',
          service: '',
          pole: '',
          fonction: '',
          division:'',
          code:'',
        });
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          if (error.response.data.error === 'User already exists') {
            setAlertMessage({ message: 'User already exists!', type: 'error' });
          } else {
            setAlertMessage({ message: error.response.data.error, type: 'error' });
          }
        } else {
          setAlertMessage({ message: 'There was an error adding the user!', type: 'error' });
        }
        console.error('There was an error adding the user!', error);
      });
  };

  return (
    <div className="user-form-container-utilisateur">
 <div className="back-button">
  <button type="button" className="back-button" onClick={() => navigate('/AllUsers')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>

      <h2 className="dashboard-title-user">Ajouter un Utilisateur</h2>
      {alertMessage.message && <Alert message={alertMessage.message} type={alertMessage.type} />}
      <div className="form-scroll-utilisateur">
        <form onSubmit={handleSubmit} className="form-utilisateur">
          <div className="form-group-utilisateur">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={invalidFields.includes('username') ? 'invalid-field' : ''}
              required
            />
          </div>
          <div className="form-group-utilisateur">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={invalidFields.includes('password') ? 'invalid-field' : ''}
              required
            />
          </div>
          <div className="form-group-utilisateur">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={invalidFields.includes('email') ? 'invalid-field' : ''}
              required
            />
          </div>
          <div className="form-group-utilisateur">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={invalidFields.includes('role') ? 'invalid-field' : ''}
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.display}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-utilisateur">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={invalidFields.includes('department') ? 'invalid-field' : ''}
              required
            />
          </div>

          <div className="form-group-utilisateur">
            <label>Pôle</label>
            <select
              name="pole"
              value={formData.pole}
              onChange={handleChange}
              className={invalidFields.includes('pole') ? 'invalid-field' : ''}
              
            >
              <option value="">Select Pole</option>
              {poles.map((pole) => (
                <option key={pole.pole_id} value={pole.pole_id}>
                  {pole.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-utilisateur">
            <label>Division</label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              className={invalidFields.includes('division') ? 'invalid-field' : ''}
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division.division_id} value={division.division_name}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-utilisateur">
            <label>Service</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={invalidFields.includes('service') ? 'invalid-field' : ''}
             
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service.service_id} value={service.service_id}>{service.name}</option>
              ))}
            </select>
          </div>

          
         
          <div className="form-group-utilisateur">
            <label>Fonction</label>
            <input
              type="text"
              name="fonction"
              value={formData.fonction}
              onChange={handleChange}
              className={invalidFields.includes('fonction') ? 'invalid-field' : ''}
            />
          </div>
          <div className="form-group-utilisateur">
            <label>code</label>
            <input
              type="number"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={invalidFields.includes('code') ? 'invalid-field' : ''}
            />
          </div>
          <button type="submit" className="utilisateur-Boutton">Ajouter Utilisateur</button>
          {errorMessage && <div className="error-message-users">{errorMessage}</div>}
        </form>
         
      </div>
    </div>
  );
}
