import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Si vous utilisez date-fns pour le formatage

const DetailsCourrierRecus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-Details-recus/${id}/`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du courrier reçu');
        }
        const data = await response.json();
        console.log("Courrier Details:", data);
        
        const filePath = data.fichier; // Le chemin du fichier reçu de l'API
        const fixedFileUrl = `http://127.0.0.1:8000/api/Courrier/media/courriers/${filePath.split('/').pop()}`;
        setFileUrl(fixedFileUrl);

        setCourrierDetails(data);

      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier reçu :', error);
        setError('Erreur lors de la récupération des détails du courrier reçu');
      }
    };
    const roleFromStorage = localStorage.getItem('role');
        if (roleFromStorage) {
            setRole(roleFromStorage);
            console.log(`Role: ${roleFromStorage}`);
        }

    fetchCourrierDetails();
  }, [id]);

  

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
  const isChef = role === 'chef' || role === 'chefservice'|| role === 'vicepresident'|| role === 'responsableservice'|| role === 'responsablePôle' || role === 'secretairegeneral' || role === 'chefdivision';
  
  return (
    <div className="courrier-details">
 <div className="back-button">
  <button type="button" className="back-button" onClick={() => navigate('/courriers-recus')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>

  <h2 className="dashboard-title">Détails du Courrier Reçus</h2>
  {error && <p style={{ color: 'red' }}>{error}</p>}
  
  <div className="line">
    <div className="input-group">
      <label htmlFor="objet"><strong>Objet</strong></label>
      <input type="text" id="objet" value={courrierDetails.objet} readOnly />
    </div>
  </div>

  <div className="line">
    <div className="input-group">
      <label htmlFor="numero"><strong>Numéro</strong></label>
      <input type="text" id="numero" value={courrierDetails.numero} readOnly />
    </div>
    <div className="input-group">
      <label htmlFor="emetteur"><strong>Émetteur</strong></label>
      <input type="text" id="emetteur" value={courrierDetails.utilisateur_username} readOnly />
    </div>
  </div>


  <div className="line">
        <div className="input-group">
          <label htmlFor="support"><strong>support</strong></label>
          <input type="text" id="support" value={courrierDetails.support} readOnly />
        </div>
        <div className="input-group">
          <label htmlFor="etablissment"><strong>établissment</strong></label>
          <input type="text" id="etablissment" value={courrierDetails.etablissment} readOnly />
        </div>
      </div>

      <div className="line">
        <div className="input-group">
          <label htmlFor="Nbentrer"><strong>Numero Entite d'origine</strong></label>
          <input type="text" id="Nbentrer" value={courrierDetails.Nbentrer} readOnly />
        </div>
        <div className="input-group">
          <label htmlFor="entrer"><strong>Date d'arrivé</strong></label>
          <input type="text" id="entrer" value={format(new Date(courrierDetails.entrer), 'yyyy-MM-dd')} readOnly />
        </div>
      </div>

  <div className="line">
    <div className="input-group">
      <label htmlFor="dateReception"><strong>Date de réception</strong></label>
      <input type="text" id="dateReception" value={formatDate(courrierDetails.sortie)} readOnly />
    </div>
    <div className="input-group">
      <label htmlFor="readAt"><strong>Lu le</strong></label>
      <input type="text" id="readAt" value={formatDate(courrierDetails.read_at)} readOnly />
    </div>
  </div>

  <div className="line">
  <div className="input-group">
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
    <div className="input-group">
      <label htmlFor="nombrePiecesJointes"><strong>Nombre de pièces jointes</strong></label>
      <input type="text" id="nombrePiecesJointes" value={courrierDetails.nombrePiecesJointes} readOnly />
    </div>
  </div>

  

  <div className="buttons">
    {isChef && (
      <button onClick={() => navigate(`/CourrierTransferer/${id}`)} className="button">Transférer</button>
    )}
  </div>
</div>
  );
};

export default DetailsCourrierRecus;
