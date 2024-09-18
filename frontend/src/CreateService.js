import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateService = () => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Réinitialiser les erreurs

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/Courrier/Create_Service/', {
        name,
      });
      console.log('Service créé:', response.data);
      navigate('/AllServices');
      setName(''); // Réinitialiser le champ de nom
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className="user-form-container-utilisateur">
      <h1 className="dashboard-title-user">Créer un Service</h1>
      <form onSubmit={handleSubmit} className="form-utilisateur">
        <div className="form-group-utilisateur">
          <label>Nom du Service</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <button type="submit" className="utilisateur-Boutton">Créer un service</button>
      </form>
    </div>
  );
};

export default CreateService;
