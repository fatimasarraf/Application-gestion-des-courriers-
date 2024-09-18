import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import './CourriersNonLus.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Assurez-vous d'importer le fichier CSS si nécessaire

const CourriersNonLus = () => {
  const navigate = useNavigate();
  const [courriers, setCourriers] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const courriersPerPage = 10;
  const [totalCourriers, setTotalCourriers] = useState(0);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_recus/${userId}/`);
        const data = response.data;

        // Filtrer les courriers qui ne sont pas lus
        const nonLusCourriers = data.filter(courrier => !courrier.is_read);

        // Trier les courriers par date de sortie en ordre décroissant
        const sortedCourriers = nonLusCourriers.sort((a, b) => new Date(b.sortie) - new Date(a.sortie));

        setCourriers(sortedCourriers);
        setTotalCourriers(sortedCourriers.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des courriers:', error);
      }
    };

    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      fetchCourriers();
    }
  }, [userId]);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleCourrierClick = async (id) => {
    try {
      // Stocker la date et l'heure du clic
      /* const clickDateTime = new Date();
      const clickDateTimeISO = new Date(clickDateTime.getTime() - clickDateTime.getTimezoneOffset() * 60000).toISOString(); */
    const today = new Date();
    const clickDateTimeISO = format(today, "yyyy-MM-dd'T'HH:mm:ss"); // Correct datetime-local format
    setCurrentDate(clickDateTimeISO);

    

      // Enregistrer la date et l'heure du clic et mettre à jour is_read dans l'API
      await axios.patch(`http://127.0.0.1:8000/api/Courrier/update_courrier_and_save_click_time/${id}/`, {
        is_read: true,
        read_at: clickDateTimeISO // Utilisation de ISOString pour l'enregistrement correct en JSON
      });

      // Mettre à jour l'état local pour refléter le changement
      setCourriers(prevCourriers =>
        prevCourriers.map(courrier =>
          courrier.id === id ? { ...courrier, is_read: true } : courrier
        )
      );

      // Naviguer vers la page de détails après marquage comme lu
      navigate(`/DetailsCourrierRecus/${id}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de lecture ou de la sauvegarde de la date de clic:', error);
    }
  };

  // Calculer les indices de pagination
  const startIndex = (currentPage - 1) * courriersPerPage;
  const endIndex = startIndex + courriersPerPage;

  // Obtenir les courriers paginés
  const paginatedCourriers = courriers.slice(startIndex, endIndex);

  return (
    <div className="courrier-container">
     
      <div className="courrier-list-container">
        <ul className="courrier-list">
          {paginatedCourriers.map(courrier => (
            <li key={courrier.id} className={`courrier-item ${courrier.is_read ? 'read' : 'unread'}`} onClick={() => handleCourrierClick(courrier.id)}>
              <div className="courrier-content">
              <span className="courrier-icon">
   <FontAwesomeIcon icon={faEnvelope} />  
</span>
                <span className="courrier-subject">{courrier.objet}</span>
                <span className="courrier-time">{format(new Date(courrier.sortie), 'yyyy-MM-dd')}</span>
                {!courrier.is_read && <span className="unread-dot"></span>}
              </div>
            </li>
          ))}
        </ul>
        {paginatedCourriers.length === 0 && <p>Aucun courrier non lu trouvé.</p>}
      </div>

      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">Précédent</button>
        <span className="page-indicator">Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={paginatedCourriers.length < courriersPerPage || (currentPage * courriersPerPage >= totalCourriers)} className="pagination-button">Suivant</button>
      </div>
    </div>
  );
};

export default CourriersNonLus;
