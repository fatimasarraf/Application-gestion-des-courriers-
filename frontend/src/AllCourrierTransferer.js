/* import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import './AllCourrierDepart.css';

const AllCourrierTransferer = () => {
  const navigate = useNavigate();
  const [courriers, setCourriers] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const courriersPerPage = 3;
  const [totalCourriers, setTotalCourriers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryDate, setSearchQueryDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_transferes/${userId}/`);
        const data = response.data;

        // Initial sorting of courriers by transfer date in descending order
        const sortedCourriers = data.sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi));

        setCourriers(sortedCourriers);
        setTotalCourriers(data.length);
      } catch (error) {
        console.error('Error fetching transferred courriers:', error);
      }
    };

    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      fetchCourriers();
    }
  }, [userId]);

  const handleNavigateToCourrierTransferer = () => {
    navigate('/CourriersTransferer');
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

  const handleSearchDateChange = (event) => {
    setSearchQueryDate(event.target.value);
  };
  const updateCourrierReadStatus = async (id) => {
    try {
      const today = new Date();
      const readAt = format(today, "yyyy-MM-dd'T'HH:mm:ss"); // Correct datetime-local format
      setCurrentDate(readAt);

      await axios.patch(`http://127.0.0.1:8000/api/Courrier/update_courrier_transferer/${id}/`, {
        is_read: true,
        read_at: readAt
      });

      // Mettre à jour l'état local pour refléter le changement
      setCourriers(prevCourriers => prevCourriers.map(courrier =>
        courrier.id === id ? { ...courrier, is_read: true, read_at: readAt } : courrier
      ));

      console.log('read_at mis à jour pour le courrier avec ID', id, ':', readAt);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de lecture:', error);
    }
  };


  const handleCourrierClick = (id) => {
    updateCourrierReadStatus(id);
    navigate(`/DetailsCourrierTransferer/${id}`);
  };

  // Pagination calculation
  const startIndex = (currentPage - 1) * courriersPerPage;
  const endIndex = startIndex + courriersPerPage;

  // Filtering and pagination of courriers
  const filteredCourriers = courriers.filter(courrier =>
    courrier.objet.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (searchQueryDate === '' || format(new Date(courrier.date_envoi), 'yyyy-MM-dd') === searchQueryDate)
  ).slice(startIndex, endIndex);

  return (
    <div className="courrier-container">
      
      
      <input
        type="text"
        placeholder="Rechercher par objet"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      
      <input
        type="date"
        value={searchQueryDate}
        onChange={handleSearchDateChange}
        className="search-input"
      />
      
      <div className="courrier-list-container">
        <ul className="courrier-list">
          {filteredCourriers.map(courrier => (
            <li key={courrier.id} className="courrier-item" onClick={() => handleCourrierClick(courrier.id)}>
            <div className="courrier-content">
              <span className="courrier-icon">
                {courrier.is_read ? '👁️' : '📧'}
              </span>
                <span className="courrier-subject">{courrier.objet}</span>
                <span className="courrier-time">{format(new Date(courrier.date_envoi), 'yyyy-MM-dd')}</span>
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

export default AllCourrierTransferer;
 */



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import './AllCourrierDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope , faFileAlt, faEye} from '@fortawesome/free-solid-svg-icons';

const AllCourrierTransferer = () => {
  const navigate = useNavigate();
  const [courriers, setCourriers] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const courriersPerPage = 10;
  const [totalCourriers, setTotalCourriers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryDate, setSearchQueryDate] = useState('');
  const [searchQueryNumero, setSearchQueryNumero] = useState('');
  

  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_transferes/${userId}/`);
        const data = response.data;

        // Initial sorting of courriers by transfer date in descending order
        const sortedCourriers = data.sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi));

        setCourriers(sortedCourriers);
        setTotalCourriers(data.length);
      } catch (error) {
        console.error('Error fetching transferred courriers:', error);
      }
    };

    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      fetchCourriers();
    }
  }, [userId]);

  const handleNavigateToCourrierTransferer = () => {
    navigate('/CourriersTransferer');
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

  const handleSearchDateChange = (event) => {
    setSearchQueryDate(event.target.value);
  };
  const handleSearchNumeroChange = (event) => {
    setSearchQueryNumero(event.target.value);
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
  

  const handleCourrierClick = (id) => {
    
    navigate(`/DetailsCourrierTransferer/${id}`);
  };

  // Pagination calculation
  const startIndex = (currentPage - 1) * courriersPerPage;
  const endIndex = startIndex + courriersPerPage;

  // Filtering and pagination of courriers
  const filteredCourriers = courriers.filter(courrier =>
    courrier.objet.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (searchQueryDate === '' || format(new Date(courrier.date_envoi), 'yyyy-MM-dd') === searchQueryDate)&&
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
            <li key={courrier.id} className="courrier-item-transfere" >
              <div className="courrier-content">
              <span className="courrier-icon">
              <FontAwesomeIcon icon={faEnvelope} color="#fbec44" /> 
</span>
                <span className="courrier-subject">{courrier.objet}</span>
                <span className="courrier-time">{format(new Date(courrier.date_envoi), 'yyyy-MM-dd')}</span>
                <span className="courrier-icons">
                 
                  <FontAwesomeIcon icon={faFileAlt} color="rgb(8, 174, 106, 0.8)" onClick={() => handleCourrierClick(courrier.id)}  />
                  <FontAwesomeIcon icon={faEye} color="rgb(8, 174, 106, 0.8)" onClick={() => handleFileOpen(courrier.fichier)}/>
                  
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

export default AllCourrierTransferer;
