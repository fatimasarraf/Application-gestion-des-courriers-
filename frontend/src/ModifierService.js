import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Users.css';
const ModifyService = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState({ name: '', chief: '' });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/Service/${serviceId}/`);
        setService(response.data);
        fetchUsers(response.data.name);
      } catch (error) {
        setErrors('Erreur lors de la récupération du service.');
      }
    };

    const fetchUsers = async (serviceName) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/UsersWithRoleInService/${serviceName}/`);
        setUsers(response.data);
      } catch (error) {
        setErrors('Erreur lors de la récupération des utilisateurs.');
      }
    };

    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the data being sent
    console.log('Data being sent:', service);

    try {
      await axios.put(`http://127.0.0.1:8000/api/Courrier/Service/${serviceId}/`, {
        name: service.name,
        chief: service.chief, 
        service_id: serviceId,
  
      });
      navigate('/AllServices');
    } catch (error) {
      console.error(error.response.data);
      setErrors('Erreur lors de la modification du service.');
    }
  };

  return (
    <div className="user-form-container-utilisateur"> {/* Utilisation de la même classe de conteneur */}
      <h2 className="dashboard-title-user">Affecter un chef de service </h2> {/* Utilisation du même titre de tableau de bord */}
      {errors && <p className="error">{errors}</p>} {/* Utilisation du même style pour les messages d'erreur */}
      <div className="form-scroll-utilisateur">
        <form onSubmit={handleSubmit} className="form-utilisateur"> {/* Utilisation de la même classe de formulaire */}
          <div className="form-group-utilisateur">
            <label>Nom du Service</label>
            <input type="text" name="name" value={service.name} onChange={handleChange} />
          </div>
          <div className="form-group-utilisateur">
            <label>Chef de Service</label>
            <select name="chief" value={service.chief} onChange={handleChange}>
              <option value="">Sélectionner un chef</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="utilisateur-Boutton">Enregistrer</button> {/* Utilisation du même style pour le bouton */}
        </form>
      </div>
    </div>
  );
};

export default ModifyService;