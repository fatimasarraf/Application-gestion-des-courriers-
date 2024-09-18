import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Users.css';

const ModifierDepartement = () => {
  const { departementId } = useParams();
  const [departement, setDepartement] = useState({ nom: '', etablissement_type: '', ville:'', email:'',telephone_fixe:'' });
  const [departementTypes, setDepartementTypes] = useState([]);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartement = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/Departement/${departementId}/`);
        setDepartement(response.data);
      } catch (error) {
        setErrors('Erreur lors de la récupération du service.');
      }
    };

    /* const fetchDepartementTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Courrier/DepartementTypes/');
        setDepartementTypes(response.data);
      } catch (error) {
        setErrors('Erreur lors de la récupération des types de département.');
      }
    }; */

    fetchDepartement();
    // fetchDepartementTypes();
  }, [departementId]);

  const handleChange = (e) => {
    setDepartement({ ...departement, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://127.0.0.1:8000/api/Courrier/Departement/${departementId}/`, {
        nom: departement.nom,
        ville: departement.ville,
        email: departement.email,
        telephone_fixe: departement.telephone_fixe,
        etablissement_type: departement.etablissement_type,
      });
      navigate('/AllDepartement');
    } catch (error) {
      console.error(error.response.data);
      setErrors('Erreur lors de la modification du service.');
    }
  };

  return (
    <div className="user-form-container-utilisateur">
      <h2 className="dashboard-title-user">Modifier établissement</h2>
      {errors && <p className="error">{errors}</p>}
      <div className="form-scroll-utilisateur">
        <form onSubmit={handleSubmit} className="form-utilisateur">
          <div className="form-group-utilisateur">
            <label>Nom de l'établissement</label>
            <input type="text" name="nom" value={departement.nom} onChange={handleChange} />
          </div>
          <div className="form-group-utilisateur">
            <label>Groupe Etablissement</label>
            <input type="text" name="etablissement_type" value={departement.etablissement_type} onChange={handleChange} />
          </div>
          {/* <div className="form-group-utilisateur">
            <label>Groupe Etablissement</label>
            <select name="etablissement_type" value={departement.etablissement_type} onChange={handleChange}>
              <option value="">Sélectionner un groupe</option>
              {departementTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div> */}
         
          <div className="form-group-utilisateur">
            <label>Ville de l'établissement</label>
            <input type="text" name="ville" value={departement.ville} onChange={handleChange} />
          </div>
          <div className="form-group-utilisateur">
            <label>Email de l'établissement</label>
            <input type="email" name="email" value={departement.email} onChange={handleChange} />
          </div>
          <div className="form-group-utilisateur">
            <label>telephone de l'établissement</label>
            <input type="text" name="telephone_fixe" value={departement.telephone_fixe} onChange={handleChange} />
          </div>
          <button type="submit" className="utilisateur-Boutton">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default ModifierDepartement;
