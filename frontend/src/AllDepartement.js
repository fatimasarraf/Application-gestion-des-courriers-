import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllUsers.css';
import swal from 'sweetalert';


const AllDepartement = () => {
  const [departements, setDepartements] = useState([]);
  const [dept, setDept] = useState([]);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // Hook for navigation

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Courrier/All_Departement/');
        setDepartements(response.data);
      } catch (error) {
        setErrors('Erreur lors de la récupération des services.');
      }

      
    };
    
    
    fetchDepartements();
  }, []);

  const handleAddService = (id) => {
    navigate(`/CreateDepartement/${id}`); // Use backticks for template literals
  };

  const handleEditDepartement = (departementId) => {
    navigate(`/ModifierDepartement/${departementId}`);
  };
 

  const handleDeleteDepartement = async (departementId) => {
    /* const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce departement ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/Courrier/Departement/${departementId}/`);
        setDepartements(departements.filter(departement => departement.id !== departementId)); // Remove service from state
      } catch (error) {
        setErrors('Erreur lors de la suppression du service.');
      }
    } */

      const confirmDelete = () => {
        
        swal({
          title: "Êtes-vous sûr de vouloir supprimer ce Etablissement ?",
          icon: "warning",
          buttons: ["Annuler", "Supprimer"],
          dangerMode: true,
        }).then((willSend) => {
          if (willSend) {
            try {
              axios.delete(`http://127.0.0.1:8000/api/Courrier/Departement/${departementId}/`);
              setDepartements(departements.filter(departement => departement.id !== departementId)); // Remove service from state
            } catch (error) {
              setErrors('Erreur lors de la suppression du service.');
            }
          }
        });
      };
      
      confirmDelete();   
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filtereddepartement = departements.filter(departement =>
    departement.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="all-users-container">
      <h2 className="dashboard-title">Tous les Etablissement</h2>
      {errors && <div className="error-message">{errors}</div>}
      <button onClick={handleAddService} className="add-user-button">
        Ajouter un Etablissement
      </button>

      <div className="search-input-users-searche">
      <input
        type="text"
        placeholder="Rechercher par nom de etablissement..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input-users"
      />
      </div>
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom du etablissement</th>
              <th>Groupe etablissement </th>
              <th>Actions</th> {/* Nouvelle colonne pour les actions */}
            </tr>
          </thead>
          <tbody>
            {filtereddepartement.map((departement) => (
              <tr key={departement.id}>
                <td>{departement.nom}</td>
                <td>{departement.etablissement_type}</td>
                <td>
                  <button onClick={() => handleEditDepartement(departement.id)} className="edit-button">Modifier</button>
                  <button onClick={() => handleDeleteDepartement(departement.id)} className="delete-button">Suprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDepartement;