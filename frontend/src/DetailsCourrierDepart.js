


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './DetailsCourrierDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DetailsCourrierDepart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-depart/${id}/`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du courrier départ');
        }
        const data = await response.json();
        console.log('Fetched courrier details:', data); // Debugging log
        console.log('Chemin du fichier:', data.fichier); // Log the file path
        
        // Générer l'URL du fichier à partir du chemin fourni
        const filePath = data.fichier; // Le chemin du fichier reçu de l'API
        const fixedFileUrl = `http://127.0.0.1:8000/api/Courrier/media/courriers/${filePath.split('/').pop()}`;
        setFileUrl(fixedFileUrl);

        setCourrierDetails(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier départ :', error);
        setError('Erreur lors de la récupération des détails du courrier départ');
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
  };

  return (
    <div className="courrier-details">
      <div className="back-button">
        <button type="button" className="back-button" onClick={() => navigate('/All_CourrierDepart')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>

      <h2 className="dashboard-title">Détails du Courrier Arrivé</h2>
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
          <label htmlFor="sortie"><strong>Date</strong></label>
          <input type="text" id="sortie" value={formatDate(courrierDetails.sortie)} readOnly />
        </div>
      </div>

      <div className="line">
        <div className="input-group">
          <label htmlFor="Nbentrer"><strong>Numero Entite d'origine</strong></label>
          <input type="text" id="Nbentrer" value={courrierDetails.Nbentrer} readOnly />
        </div>
        <div className="input-group">
          <label htmlFor="entrer"><strong>Arrivée le</strong></label>
          <input type="text" id="entrer" value={format(new Date(courrierDetails.entrer), 'yyyy-MM-dd')} readOnly />
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
          <label htmlFor="destinerA"><strong>Destiné à</strong></label>
          <input type="text" id="destinerA" value={courrierDetails.destinerA} readOnly />
        </div>
        <div className="input-group">
          <label htmlFor="statut"><strong>Statut</strong></label>
          <input type="text" id="statut" value={courrierDetails.read_at ? 'Courrier lu' : 'Courrier non lu'} readOnly />
        </div>
        {courrierDetails.read_at && (
          <div className="line">
            <div className="input-group">
              <label htmlFor="read_at"><strong>Lu le</strong></label>
              <input type="text" id="read_at" value={formatDate(courrierDetails.read_at)} readOnly />
            </div>
          </div>
        )}
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
        <button onClick={() => navigate(`/CourrierArchiver/${id}`)} className="button">Archiver</button>
      </div>
    </div>
  );
};

export default DetailsCourrierDepart;














