/* import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllUsers.css';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users data from the backend
    axios.get('http://127.0.0.1:8000/api/Courrier/users_list/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        setErrorMessage('There was an error fetching the users!');
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  const handleAddUser = (id) => {
    navigate(`/Users/${id}`); // Navigate to the user creation page
  };

  return (
    <div className="all-users-container">
      <h2>All Users</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button onClick={handleAddUser} className="add-user-button">
        Add New User
      </button>
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              
              <th>Role</th>
              <th>Service</th>
              <th>Pole</th>
              <th>Fonction</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
               
                <td>{user.role}</td>
                <td>{user.service}</td>
                <td>{user.pole}</td>
                <td>{user.fonction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllUsers.css';
import swal from 'sweetalert';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users data from the backend
    axios.get('http://127.0.0.1:8000/api/Courrier/users_list/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        setErrorMessage('There was an error fetching the users!');
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  const handleAddUser = () => {
    navigate('/Users/add'); // Navigate to the user creation page
  };

  const handleEditUser = (userId) => {
    navigate(`/Modifieruser/${userId}`); // Navigate to edit user page
  };

  const handleDeleteUser = async (userId) => {
    /* const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/Courrier/User/${userId}/`);
        setUsers(users.filter(user => user.id !== userId)); // Remove user from state
      } catch (error) {
        setErrorMessage("Erreur lors de la suppression de l'utilisateur.");
        console.error("Erreur lors de la suppression de l'utilisateur.", error);
      }
    } */

      const confirmDelete = () => {
        
        swal({
          title: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
          icon: "warning",
          buttons: ["Annuler", "Supprimer"],
          dangerMode: true,
        }).then((willSend) => {
          if (willSend) {
            try {
              axios.delete(`http://127.0.0.1:8000/api/Courrier/User/${userId}/`);
              setUsers(users.filter(user => user.id !== userId)); // Remove user from state
            } catch (error) {
              setErrorMessage("Erreur lors de la suppression de l'utilisateur.");
              console.error("Erreur lors de la suppression de l'utilisateur.", error);
            }
          }
        });
      };
      
      confirmDelete();  
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filtrer les utilisateurs par nom d'utilisateur
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="all-users-container">
      <h2 className="dashboard-title">Table des Utilisateurs</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button onClick={handleAddUser} className="add-user-button">
        Ajouter un Utilisateur
      </button>
      {/* Barre de recherche */}
      <div className="search-input-users-searche">
      <input
        type="text"
        placeholder="Rechercher par nom d'utilisateur..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input-users"
      />
      </div>
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              
              <th>Fonction</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                
                <td>{user.fonction}</td>
                <td>
                  <button onClick={() => handleEditUser(user.user_id)} className="edit-button">Modifier</button>
                  <button onClick={() => handleDeleteUser(user.user_id)} className="delete-button">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
