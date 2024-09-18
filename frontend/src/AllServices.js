import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllUsers.css';
import swal from 'sweetalert';
const AllServices = () => {
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Courrier/All_Service/');
        setServices(response.data);
      } catch (error) {
        setErrors('Erreur lors de la récupération des services.');
      }

      
    };
    
    
    fetchServices();
  }, []);

  const handleAddService = (id) => {
    navigate(`/CreateService/${id}`); // Use backticks for template literals
  };

  const handleEditService = (serviceId) => {
    navigate(`/ModifierService/${serviceId}`);
  };
 

  const handleDeleteService = async (serviceId) => {
    /* const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/Courrier/Service/${serviceId}/`);
        setServices(services.filter(service => service.service_id !== serviceId)); // Remove service from state
      } catch (error) {
        setErrors('Erreur lors de la suppression du service.');
      }
    } */
      const confirmDelete = () => {
        
        swal({
          title: "Êtes-vous sûr de vouloir supprimer ce service ?",
          icon: "warning",
          buttons: ["Annuler", "Supprimer"],
          dangerMode: true,
        }).then((willSend) => {
          if (willSend) {
            try {
               axios.delete(`http://127.0.0.1:8000/api/Courrier/Service/${serviceId}/`);
              setServices(services.filter(service => service.service_id !== serviceId)); // Remove service from state
            } catch (error) {
              setErrors('Erreur lors de la suppression du service.');
            }
          }
        });
      };
      
      confirmDelete(); 
  };
  return (
    <div className="all-users-container">
      <h2 className="dashboard-title">Tous les Services</h2>
      {errors && <div className="error-message">{errors}</div>}
      <button onClick={handleAddService} className="add-user-button">
        Ajouter un Service
      </button>
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom du Service</th>
              <th>Chef de Service</th>
              <th>Actions</th> {/* Nouvelle colonne pour les actions */}
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.service_id}>
                <td>{service.name}</td>
                <td>{service.chief_name}</td>
                <td>
                  <button onClick={() => handleEditService(service.service_id)} className="edit-button">Affecter chef</button>
                  <button onClick={() => handleDeleteService(service.service_id)} className="delete-button">Suprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllServices;