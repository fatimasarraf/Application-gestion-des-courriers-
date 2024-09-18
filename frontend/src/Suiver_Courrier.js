/* // SuiverCourrier.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SuiverCourrier = () => {
  const [courriers, setCourriers] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      console.log(`User ID: ${userIdFromStorage}`);
    }
    const fetchCourriers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/suiver-courrier/${userId}/`, {
         
        });
        setCourriers(response.data);
      } catch (error) {
        console.error("There was an error fetching the courriers!", error);
      }
    };
   

    fetchCourriers();
  }, [userId]);

  return (
    <div>
      <h1>Suiver Courrier</h1>
      <table>
        <thead>
          <tr>
            <th>Objet</th>
            <th>Read At</th>
            <th>Is Read</th>
            <th>Destiner A</th>
            <th>Sortie</th>
          </tr>
        </thead>
        <tbody>
          {courriers.map(courrier => (
            <tr key={courrier.id}>
              <td>{courrier.objet}</td>
              <td>{courrier.read_at}</td>
              <td>{courrier.is_read ? 'Yes' : 'No'}</td>
              <td>{courrier.destinerAId.map(user => user.username).join(', ')}</td>
              <td>{courrier.sortie}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuiverCourrier; */




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import './AllCourrierDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
const SuiverCourrier = () => {
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
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/suiver-courrier/${userId}/` )
        const data = response.data;

        // Initial sorting of courriers by archived_at date in descending order
        const sortedCourriers = data.sort((a, b) => new Date(b.sortie) - new Date(a.sortie));

        setCourriers(sortedCourriers);
        setTotalCourriers(data.length);
      } catch (error) {
        console.error('Error fetching archived courriers:', error);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchDateChange = (event) => {
    setSearchQueryDate(event.target.value);
  };
  const handleSearchNumeroChange = (event) => {
    setSearchQueryNumero(event.target.value);
  };
 

  // Pagination calculation
  const startIndex = (currentPage - 1) * courriersPerPage;
  const endIndex = startIndex + courriersPerPage;

  // Filtering and pagination of courriers
  const filteredCourriers = courriers.filter(courrier =>
    courrier.objet.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (searchQueryDate === '' || format(new Date(courrier.sortie), 'yyyy-MM-dd') === searchQueryDate)&&
    (searchQueryNumero === '' || (courrier.numero && courrier.numero.toString().toLowerCase().includes(searchQueryNumero.toLowerCase())) ||
      (courrier.Nbentrer && courrier.Nbentrer.toString().toLowerCase().includes(searchQueryNumero.toLowerCase())))
  ).slice(startIndex, endIndex);
  
  const formatDate = (dateString) => {
    if (!dateString) {
      return '';  // Gérer le cas où dateString est null ou undefined
    }
    return dateString.replace('T', ' ').replace('Z', '');
    // Si vous utilisez date-fns pour le formatage, vous pouvez l'adapter comme suit
    // return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  };
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
            <li key={courrier.id} className={`courrier-item ${courrier.is_read ? 'read' : 'unread'}`}>
                <div className="courrier-content">
                    <span className="courrier-icon">
                        {courrier.is_read ? (
                            <FontAwesomeIcon icon={faEnvelopeOpen} color="#fbec44" />
                        ) : (
                            <FontAwesomeIcon icon={faEnvelope} color="#fbec44"/>
                        )}
                    </span>
                    <div className="courrier-containers-info">
                        <div className="courrier-header">
                            <span className="courrier-subject_suivant">{courrier.objet}</span>
                            <div className="envoye-le">
                            <label ><strong>Envoye le</strong></label>
                            <span className="courrier-time_suivant">
                            {formatDate(courrier.sortie)}
                            </span>
                            </div>
                        </div>
                        <div className="courrier-info">
                            <div className="info-line">
                                <div className="statut">
                                    <label htmlFor={`statut-${courrier.id}`}><strong>Statut:</strong></label>
                                    <span id={`statut-${courrier.id}`} className="statut-value">
                                        {courrier.read_at ? 'Courrier lu' : 'Courrier non lu'}
                                    </span>
                                </div>
                                {courrier.read_at && (
                                    <div className="lu-le">
                                        <label htmlFor={`read_at-${courrier.id}`}><strong>Lu le:</strong></label>
                                        <span id={`read_at-${courrier.id}`} className="read-at-value">
                                            {formatDate(courrier.read_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="destinataire">
                                <label><strong>Transféré à</strong></label>
                                <span className="courrier-destine">{courrier.destinerA}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        ))}
    </ul>
    {filteredCourriers.length === 0 && <p>Aucun courrier trouvé.</p>}
</div>




  <div className="pagination-buttons">
    <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">Précédent</button>
    <span className="page-indicator">Page {currentPage}</span>
    <button
      onClick={handleNextPage}
      disabled={filteredCourriers.length < courriersPerPage || (currentPage * courriersPerPage >= totalCourriers)}
      className="pagination-button"
    >
      Suivant
    </button>
  </div>
</div>
  );
};

export default SuiverCourrier;

