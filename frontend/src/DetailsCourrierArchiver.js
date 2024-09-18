import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { format } from 'date-fns';
import './DetailsCourrierDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DetailsCourrierArchiver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers_archives_details/${id}/`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du courrier archivé');
        }
        const data = await response.json();
        console.log("Courrier Details:", data);
       

        const filePath = data.fichier; // Le chemin du fichier reçu de l'API
        const fixedFileUrl = `http://127.0.0.1:8000/api/Courrier/media/courriers/${filePath.split('/').pop()}`;
        setFileUrl(fixedFileUrl);

        setCourrierDetails(data);

        
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier archivé :', error);
        setError('Erreur lors de la récupération des détails du courrier archivé');
      }

      
    };
    

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

  return (
    <div className="courrier-details">
      <div className="back-button">
  <button type="button" className="back-button" onClick={() => navigate('/AllCourrierArchiver')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>

    <h2 className="dashboard-title">Détails du Courrier Archivé</h2>
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
        <label htmlFor="Nbentrer"><strong>Numero Entite d'origine</strong></label>
        <input type="text" id="Nbentrer" value={courrierDetails.Nbentrer} readOnly />
      </div>
    </div>
    <div className="line">
      <div className="input-group">
        <label htmlFor="support"><strong>support</strong></label>
        <input type="text" id="support" value={courrierDetails.support} readOnly />
      </div>
    
      <div className="input-group">
        <label htmlFor="etablissment"><strong>Etablissement</strong></label>
        <input type="text" id="etablissment" value={courrierDetails.etablissment} readOnly />
      </div>
    </div>

    <div className="line">
      <div className="input-group">
        <label htmlFor="entrer"><strong>Date d'arrivée</strong></label>
        <input 
    type="text" 
    value={courrierDetails.entrer ? courrierDetails.entrer.split('T')[0] : ''} 
    readOnly 
  />
      </div>
      <div className="input-group">
        <label htmlFor="utilisateur_username"><strong>Archivé par</strong></label>
        <input type="text" id="utilisateur_username" value={courrierDetails.utilisateur_username} readOnly />
      </div>
    </div>
    <div className="line">
      <div className="input-group">
        <label htmlFor="archived_at"><strong>Date d'archivage</strong></label>
        <input type="text" id="archived_at" value={formatDate(courrierDetails.archived_at)} readOnly />
      </div>
      <div className="input-group">
        <label htmlFor="numeroOrdre"><strong>Numéro Bureau d'ordre</strong></label>
        <input type="text" id="numeroOrdre" value={courrierDetails.numeroOrdre} readOnly />
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
    </div>
    
    
  </div>
);
};
export default DetailsCourrierArchiver;
