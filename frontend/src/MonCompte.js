import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';
const MonCompte = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer l'ID utilisateur depuis localStorage
        const userIdFromStorage = localStorage.getItem('user_id');
        if (userIdFromStorage) {
          setUserId(userIdFromStorage);
        }

        // Faire une requête GET vers votre API Django avec l'ID utilisateur
        if (userId) {
          const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/current_user/${userId}/`);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="user-form-container-utilisateur">
    <h2 className="dashboard-title-service">Mon Compte</h2>
    {user ? (
      <div className="form-scroll-utilisateur">
        <div className="form-group-utilisateur">
          <label className="form-scroll-utilisateur-service">Username</label>
          <input type="text" value={user.username} readOnly />
        </div>
        <div className="form-group-utilisateur">
          <label className="form-scroll-utilisateur-service">Email</label>
          <input type="email" value={user.email} readOnly />
        </div>
        <div className="form-group-utilisateur">
          <label className="form-scroll-utilisateur-service">Pôle</label>
          <input type="text" value={user.utilisateur_pole || ''} readOnly />
        </div>
        <div className="form-group-utilisateur">
          <label className="form-scroll-utilisateur-service">Division</label>
          <input type="email" value={user.division} readOnly />
        </div>
        <div className="form-group-utilisateur">
          <label className="form-scroll-utilisateur-service">Service</label>
          <input type="text" value={user.utilisateur_service || ''} readOnly />
        </div>
        <div className="form-group-utilisateur">
          <label className="form-scroll-utilisateur-service">Fonction</label>
          <input type="text" value={user.fonction || ''} readOnly />
        </div>
        
        {/* Ajoutez d'autres détails de l'utilisateur ici */}
      </div>
    ) : (
      <p>Chargement en cours...</p>
    )}
  </div>
);
};

export default MonCompte;