


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import './AllCourrierDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope ,faEnvelopeOpen, faFileAlt, faEye, faExchangeAlt} from '@fortawesome/free-solid-svg-icons';


const CourriersRecus = () => {
  const navigate = useNavigate();
  const [courriers, setCourriers] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const courriersPerPage = 10;
  const [totalCourriers, setTotalCourriers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryDate, setSearchQueryDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchQueryNumero, setSearchQueryNumero] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_recus/${userId}/`);
        const data = response.data;

        // Sort courriers by date (sortie) in descending order
        const sortedCourriers = data.sort((a, b) => new Date(b.sortie) - new Date(a.sortie));

        setCourriers(sortedCourriers);
        setTotalCourriers(data.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des courriers:', error);
      }
    };

    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      fetchCourriers();
    }

    const roleFromStorage = localStorage.getItem('role');
    if (roleFromStorage) {
        setRole(roleFromStorage);
        console.log(`Role: ${roleFromStorage}`);
    }
  }, [userId]);

 

  const handleNavigateToCourrierRecus = () => {
    navigate('/CourriersRecus');
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFileOpen = (fileUrl) => {
    try {
      // Construct the full file URL
      const fixedFileUrl = `http://127.0.0.1:8000/api/Courrier/media/courriers/${fileUrl.split('/').pop()}`;
      
      // Open the file in a new tab or window
      window.open(fixedFileUrl, '_blank');
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du fichier :', error);
    }
  };

  const handleSearchDateChange = (event) => {
    setSearchQueryDate(event.target.value);
  };

  const updateCourrierReadStatus = async (id) => {
    try {
      const courrier = courriers.find(courrier => courrier.id === id);
      
      if (courrier && !courrier.is_read) {
        const today = new Date();
        const readAt = format(today, "yyyy-MM-dd'T'HH:mm:ss"); // Correct datetime-local format
        setCurrentDate(readAt);

        // Update the read status in CourrierDepart
        await axios.patch(`http://127.0.0.1:8000/api/Courrier/update_courrier_depart/${id}/`, {
          is_read: true,
          read_at: readAt
        });

        // Update the read status in CourrierTransferer if applicable
        await axios.patch(`http://127.0.0.1:8000/api/Courrier/update_transfer/${id}/`, {
          is_read: true,
          read_at: readAt
        });

        // Update local state to reflect the change
        setCourriers(prevCourriers => prevCourriers.map(courrier =>
          courrier.id === id ? { ...courrier, is_read: true, read_at: readAt } : courrier
        ));

        console.log('read_at mis à jour pour le courrier avec ID', id, ':', readAt);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de lecture:', error);
    }
  };

  const handleCourrierClick = (id) => {
    updateCourrierReadStatus(id);
    navigate(`/DetailsCourrierRecus/${id}`);
  };
  const handleTransferClick = (id) => {
   
    navigate(`/CourrierTransferer/${id}`);
  };

  
  const handleSearchNumeroChange = (event) => {
    setSearchQueryNumero(event.target.value);
  };
  // Calculate pagination indices
  const startIndex = (currentPage - 1) * courriersPerPage;
  const endIndex = startIndex + courriersPerPage;

  // Filter and paginate courriers
  const filteredCourriers = courriers.filter(courrier =>
    courrier.objet.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (searchQueryDate === '' || format(new Date(courrier.sortie), 'yyyy-MM-dd') === searchQueryDate) &&
    
    (searchQueryNumero === '' || (courrier.numero && courrier.numero.toString().toLowerCase().includes(searchQueryNumero.toLowerCase())) ||
      (courrier.Nbentrer && courrier.Nbentrer.toString().toLowerCase().includes(searchQueryNumero.toLowerCase())))
    
  ).slice(startIndex, endIndex);

  return (
    <div className="courrier-container">
     
      <div className="search-container">
      <input
        type="text"
        placeholder="Rechercher par objet"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
<input
  type="text"
  placeholder="Rechercher par numéro"
  value={searchQueryNumero}
  onChange={handleSearchNumeroChange}
  className="search-input"
/>
      <input
        type="date"
        value={searchQueryDate}
        onChange={handleSearchDateChange}
        className="search-input"
      />
</div>
      
      <div className="courrier-list-container">
        <ul className="courrier-list">
          {filteredCourriers.map(courrier => (
            <li key={courrier.id} className={`courrier-item ${courrier.is_read ? 'read' : 'unread'}`} >
              <div className="courrier-content">
              <span className="courrier-icon">
              {courrier.is_read ? <FontAwesomeIcon icon={faEnvelopeOpen} /> : <FontAwesomeIcon icon={faEnvelope} color="red"/>}
</span>
                <span className="courrier-subject">{courrier.objet}</span>
                <span className="courrier-time">{format(new Date(courrier.sortie), 'yyyy-MM-dd')}</span>
                {!courrier.is_read && <span className="unread-dot"></span>}

                <span className="courrier-icons">
                 
                  <FontAwesomeIcon icon={faFileAlt} color="rgb(8, 174, 106, 0.8)" onClick={() => handleCourrierClick(courrier.id)}  />
                  <FontAwesomeIcon icon={faEye} color="rgb(8, 174, 106, 0.8)" onClick={() => handleFileOpen(courrier.fichier)}/>
                  {role !== 'Utilisateur' && role !== 'chefcentre' && (
                    <FontAwesomeIcon icon={faExchangeAlt} color="rgb(8, 174, 106, 0.8)" onClick={() => handleTransferClick(courrier.id)} />
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {filteredCourriers.length === 0 && <p>Aucun courrier trouvé.</p>}
      </div>

      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">Précédent</button>
        <span className="page-indicator">Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={filteredCourriers.length < courriersPerPage || (currentPage * courriersPerPage >= totalCourriers)} className="pagination-button">Suivant</button>
      </div>
    </div>
  );
};

export default CourriersRecus;
