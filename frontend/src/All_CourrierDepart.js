import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './AllCourrierDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faEnvelope, faFileAlt,faArchive, faEye } from '@fortawesome/free-solid-svg-icons';


const AllCourrierDepart = () => {
  const navigate = useNavigate();
  const [courriersDepart, setCourriersDepart] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const courriersPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryDate, setSearchQueryDate] = useState('');
  const [searchQueryNumero, setSearchQueryNumero] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const fetchAllCourriers = async () => {
      try {
        let allCourriers = [];
        let page = 1;
        let morePages = true;

        while (morePages) {
          const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-depart/?user_id=${userId}&ordering=-sortie&page=${page}&page_size=100`);
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des courriers de départ');
          }

          
          const data = await response.json();
          allCourriers = allCourriers.concat(data.results);
          morePages = data.next !== null;
          page++;

        }

        // Tri des courriers par date de sortie (sortie) de manière décroissante
        const sortedCourriers = allCourriers.sort((a, b) => new Date(b.sortie) - new Date(a.sortie));
        setCourriersDepart(sortedCourriers);
      } catch (error) {
        console.error('Erreur lors de la récupération des courriers de départ :', error);
      }
    };

    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      fetchAllCourriers();
    }
  }, [userId]);

  const handleNavigateToCourrierDepart = () => {
    navigate('/CourrierDepart');
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
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

  const handleCourrierClick = (id) => {
    navigate(`/DetailsCourrierDepart/${id}`);
  };
  const handleArchiverClick = (id) => {
    navigate(`/CourrierArchiver/${id}`);
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

  // Filtrage des courriers
  const filteredCourriers = courriersDepart.filter((courrier) =>
    courrier.objet.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (searchQueryDate === '' || format(new Date(courrier.sortie), 'yyyy-MM-dd') === searchQueryDate) &&
    (searchQueryNumero === '' || (courrier.numero && courrier.numero.toString().toLowerCase().includes(searchQueryNumero.toLowerCase())) ||
      (courrier.Nbentrer && courrier.Nbentrer.toString().toLowerCase().includes(searchQueryNumero.toLowerCase())))
  );

  // Pagination
  const startIndex = (currentPage - 1) * courriersPerPage;
  const currentCourriers = filteredCourriers.slice(startIndex, startIndex + courriersPerPage);
  const totalPages = Math.ceil(filteredCourriers.length / courriersPerPage);

  return (
    <div className="courrier-container">
       <div className="header">
      <button onClick={handleNavigateToCourrierDepart} className="new-courrier-button">
        Nouveau Courrier Arrives
      </button>
      </div>
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
          {currentCourriers.map((courrier) => (
            <li key={courrier.id} className="courrier-item_Depart" >
              <div className="courrier-content">
              <span className="courrier-icon">
  {courrier.is_read ? <FontAwesomeIcon icon={faEnvelopeOpen} /> : <FontAwesomeIcon icon={faEnvelope} color="red"/>}
</span>
                <span className="courrier-subject">{courrier.objet}</span>
                <span className="courrier-time">{format(new Date(courrier.sortie), 'yyyy-MM-dd')}</span>
                <span className="courrier-icons">
                 
                  <FontAwesomeIcon icon={faFileAlt} color="rgb(8, 174, 106, 0.8)" onClick={() => handleCourrierClick(courrier.id)}  />
                  <FontAwesomeIcon icon={faEye} color="rgb(8, 174, 106, 0.8)" onClick={() => handleFileOpen(courrier.fichier)}/>
                  <FontAwesomeIcon icon={faArchive}  color="rgb(8, 174, 106, 0.8)" onClick={() => handleArchiverClick(courrier.id)}  />
                </span>
              </div>
            </li>
          ))}
        </ul>
        {currentCourriers.length === 0 && <p>Aucun courrier trouvé.</p>}
      </div>

      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
          Précédent
        </button>
        <span className="page-indicator">Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages} className="pagination-button">
          Suivant
        </button>
      </div>
    </div>
  );
};

export default AllCourrierDepart;
