import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateDepartement = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone_fixe, setTelephone_fixe] = useState('');
  
  const [ville, setVille] = useState('');
  const [etablissementType, setEtablissementType] = useState(''); // State for establishment type
  const [errors, setErrors] = useState({});
  const [departementTypes, setDepartementTypes] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Réinitialiser les erreurs

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/Courrier/Create_Departement/', {
        nom,
        etablissement_type: etablissementType,
        ville,
        email,
        telephone_fixe, // Send establishment type with the request
      });
      console.log('departement créé:', response.data);
      navigate('/AllDepartement');
      setNom(''); // Réinitialiser le champ de nom
      setEtablissementType('');
      setVille('');
      setEmail('');
      setTelephone_fixe(''); // Réinitialiser le champ de type d'établissement
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  const fetchDepartementTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/Courrier/DepartementTypes/');
      setDepartementTypes(response.data);
    } catch (error) {
      setErrors({ fetch: 'Erreur lors de la récupération des types de département.' }); // Updated error handling
    }
  };

  useEffect(() => {
    fetchDepartementTypes(); // Fetch department types when the component mounts
  }, []);

  return (
    <div className="user-form-container-utilisateur">
      <h1 className="dashboard-title-user">Créer un établissement</h1>
      <form onSubmit={handleSubmit} className="form-utilisateur">
        <div className="form-group-utilisateur">
          <label>Nom de l'établissement</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group-utilisateur">
          <label>Groupe Etablissement</label>
          <input
            type="text"
            value={etablissementType}
            onChange={(e) => setEtablissementType(e.target.value)}
            required
          />
          {errors.etablissement_type && <p className="error">{errors.etablissement_type}</p>} 
        </div>
        {/* <div className="form-group-utilisateur">
          <label>Groupe Etablissement</label>
          <select 
            name="etablissement_type" 
            value={etablissementType} 
            onChange={(e) => setEtablissementType(e.target.value)} 
            required
          >
            <option value="">Sélectionner un groupe</option>
            {departementTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>


          {errors.etablissement_type && <p className="error">{errors.etablissement_type}</p>} 
        </div> */}

        <div className="form-group-utilisateur">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
              required
            />
          </div>
          <div className="form-group-utilisateur">
            <label>Ville</label>
            <input
              type="text"
              name="Ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              required
            />
          </div>

          <div className="form-group-utilisateur">
            <label>telephone</label>
            <input
              type="text"
              name="telephone"
              value={telephone_fixe}
              onChange={(e) => setTelephone_fixe(e.target.value)}
              
              required
            />
          </div>
        <button type="submit" className="utilisateur-Boutton">Créer un établissement</button>
      </form>
    </div>
  );
};

export default CreateDepartement;
