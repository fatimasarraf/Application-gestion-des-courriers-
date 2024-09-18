
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { format } from 'date-fns';
import './CourrierArchiver.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CourrierArchiver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [numeroOrdre, setNumeroOrdre] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [archivedMessage, setArchivedMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-Details-recus/${id}/`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du courrier');
        }
        const data = await response.json();
        
        setIsArchived(data.is_archived); // Vérifier si le courrier est déjà archivé
        if (data.is_archived) {
          setArchivedMessage('Ce courrier est déjà archivé.');
        }
        console.log('Détails du courrier récupérés :', data);
         
        const filePath = data.fichier; // Le chemin du fichier reçu de l'API
        const fixedFileUrl = `http://127.0.0.1:8000/api/Courrier/media/courriers/${filePath.split('/').pop()}`;
        setFileUrl(fixedFileUrl);

        setCourrierDetails(data);

      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier :', error);
        setError('Erreur lors de la récupération des détails du courrier');
      }

      const userIdFromStorage = localStorage.getItem('user_id');
      if (userIdFromStorage) {
        setUserId(userIdFromStorage);
      } else {
        setError('Erreur : utilisateur non connecté');
      }
    };

    fetchCourrierDetails();
  }, [id]);

  const handleNumeroOrdreChange = (e) => {
    setNumeroOrdre(e.target.value);
    setInvalidFields(invalidFields.filter(field => field !== 'numeroOrdre'));
  };

  const handleArchive = async () => {
    if (!numeroOrdre.trim()) {
      setInvalidFields(['numeroOrdre']);
      setErrorMessage('Le numéro d\'ordre est obligatoire');
      return;
    }

    const today = new Date();
    const clickDateTimeISO = format(today, "yyyy-MM-dd'T'HH:mm:ss"); // Correct datetime-local format
    setCurrentDate(clickDateTimeISO);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/Courrier/archiver/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numeroOrdre: numeroOrdre,
          click_time: clickDateTimeISO,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'archivage du courrier');
      }

      console.log('Courrier archivé avec succès.');
      navigate('/AllCourrierArchiver');
    } catch (error) {
      console.error('Erreur lors de l\'archivage du courrier :', error);
      setError('Erreur lors de l\'archivage du courrier');
    }
  };

  const handleClickArchive = () => {
    if (isArchived) {
      setShowAlert(true); // Afficher l'alerte si le courrier est déjà archivé
    } else {
      handleArchive(); // Sinon, procéder à l'archivage normalement
    }
  };

  const handleRedirectDetailsRecus = () => {
    navigate(`/DetailsCourrierRecus/${id}`);
  };

  if (!courrierDetails) {
    return <p>Chargement...</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return '';  // Gérer le cas où dateString est null ou undefined
    }
    return dateString.replace('T', ' ').replace('Z', '');
    // Si vous utilisez date-fns pour le formatage, vous pouvez l'adapter comme suit
    // return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  };

  

  return (
    <div className="courrier-container" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div className="back-button">
  <button type="button" className="back-button" onClick={() => navigate('/All_CourrierDepart')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>
      <h2 className="dashboard-title">Détails du Courrier</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {archivedMessage && <div className="alert alert-success">{archivedMessage}</div>}
      {showAlert && <div className="alert alert-warning">Ce courrier est déjà archivé</div>}
      <div className="courrier-archiver">
        <div className="courrier-archiver">
          <label><strong>Numéro</strong></label>
          <input type="text" value={courrierDetails.numero} readOnly />
        </div>
        <div className="courrier-archiver">
          <label><strong>Date</strong></label>
          <input type="text" value={courrierDetails.sortie && courrierDetails.sortie.replace('T', ' ').replace('Z', '')} readOnly />
        </div>
        
        <div className="courrier-archiver">
          <label><strong>Numero Entite d'origine</strong></label>
          <input type="text" value={courrierDetails.Nbentrer} readOnly />
        </div>
        <div className="courrier-archiver">
  <label><strong> Date d'arrivée</strong></label>
  <input 
    type="text" 
    value={courrierDetails.entrer ? courrierDetails.entrer.split('T')[0] : ''} 
    readOnly 
  />
</div>
        
        <div className="courrier-archiver">
          <label><strong>support</strong></label>
          <input type="text" value={courrierDetails.support} readOnly />
        </div>
        <div className="courrier-archiver">
          <label><strong>Etablissement</strong></label>
          <input type="text" value={courrierDetails.etablissment} readOnly />
        </div>
        <div className="courrier-archiver">
          <label><strong>Destiné à</strong></label>
          <input type="text" value={courrierDetails.destinerA} readOnly />
        </div>
        <div className="courrier-archiver">
          <label><strong>Émetteur</strong></label>
          <input type="text" value={courrierDetails.utilisateur_username} readOnly />
        </div>
        <div className="courrier-archiver">
          <label><strong>Objet</strong></label>
          <input type="text" value={courrierDetails.objet} readOnly />
        </div>
        <div className="courrier-archiver">
          <label htmlFor="fichier"><strong>Fichier</strong></label>
          <input
            type="text"
            id="fichier"
            value={courrierDetails.fichier.split('/').pop()}
            readOnly
            onClick={() => window.open(fileUrl, '_blank')}
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: '#5c5c5d',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          />
        </div>
        <div className="courrier-archiver">
          <label><strong>Nombre de pièces jointes</strong></label>
          <input type="text" value={courrierDetails.nombrePiecesJointes} readOnly />
        </div>
        <div className="courrier-archiver">
          <label><strong>Statut</strong></label>
          <input type="text" value={courrierDetails.read_at ? 'Courrier lu' : 'Courrier non lu'} readOnly />
        </div>
        {courrierDetails.read_at && (
          <div className="courrier-archiver">
            <label><strong>Lu le</strong></label>
            <input type="text" value={formatDate(courrierDetails.read_at)} readOnly />
          </div>
        )}
      </div>
      <form className="courrier-form">
        <div className="courrier-archiver">
          <label>Numéro Bureau d'ordre</label>
          <input
            type="text"
            value={numeroOrdre}
            onChange={handleNumeroOrdreChange}
            className={invalidFields.includes('numeroOrdre') ? 'invalid-field' : ''}
            
          />
        </div>
      </form>
      <button type="button" onClick={handleClickArchive} disabled={isArchived} className={isArchived ? 'button-disabled' : 'button-archive'}>
        Archiver
      </button>
      {errorMessage && <div className="error-message-archiver">{errorMessage}</div>} {/* Display error message here */}
    </div>
  );
};

export default CourrierArchiver;
