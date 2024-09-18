/* import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PDFViewer from 'pdf-viewer-reactjs';
import { format } from 'date-fns';

const DetailsCourrierTransferer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers_transferes_details/${id}/`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du courrier transféré');
        }
        const data = await response.json();
        console.log("Courrier Details:", data);
        setCourrierDetails(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier transféré :', error);
        setError('Erreur lors de la récupération des détails du courrier transféré');
      }
    };
    

    fetchCourrierDetails();
  }, [id]);

  const fetchFileContent = async () => {
    if (!courrierDetails) {
      setError('Aucun détail de courrier disponible');
      return;
    }

    try {
      const filePath = `http://127.0.0.1:8000${courrierDetails.fichier}`;
      console.log('Chemin du fichier:', courrierDetails.fichier);
      const response = await fetch(filePath);
      console.log('File Content Response:', response);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du contenu du fichier (${response.status} ${response.statusText})`);
      }

      // Assuming the file is a PDF, you can read it as a blob and then create a URL
      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      setFileUrl(fileUrl);
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu du fichier :', error);
      setError('Erreur lors de la récupération du contenu du fichier');
    }
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
    <div className="courrier-details">
      <h2>Détails du Courrier Transféré</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><strong>Numéro:</strong> {courrierDetails.incremented_number}</p>
      <p><strong>Date de transfert:</strong> {formatDate(courrierDetails.date_envoi)}</p>
      <p><strong>Transféré A:</strong> {courrierDetails.utilisateur_usernames}</p>
      <p><strong>commentaire:</strong> {courrierDetails.commentaire}</p>
      <p><strong>raison:</strong> {courrierDetails.raison}</p>
      
      <p><strong>Objet:</strong> {courrierDetails.objet}</p>
      <p><strong>Nombre de pièces jointes:</strong> {courrierDetails.nombre_pieces_jointes}</p>
      {courrierDetails.read_at && (
        <p><strong>Lu le:</strong> {formatDate(courrierDetails.read_at)}</p>
      )}
      <p><strong>Statut:</strong> {courrierDetails.read_at ? 'Courrier lu' : 'Courrier non lu'}</p>
      <p>
        <strong>Fichier:</strong>
        <span onClick={fetchFileContent} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
          {courrierDetails.fichier.split('/').pop()}
        </span>
      </p>
      
      {fileUrl && (
        <div>
          <PDFViewer
            document={{
              url: fileUrl,
            }}
          />
        </div>
        
      )}
       <button type="button" className="back-button" onClick={() => navigate('/AllCourrierTransferer')}>
              Retour
      </button>
      
    </div>
  );
};

export default DetailsCourrierTransferer;
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { format } from 'date-fns';
import './DetailsCourrierDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DetailsCourrierTransferer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers_transferes_details/${id}/`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du courrier transféré');
        }
        const data = await response.json();
        console.log("Courrier Details:", data);
        

        const filePath = data.fichier; // Le chemin du fichier reçu de l'API
        const fixedFileUrl = `http://127.0.0.1:8000/api/Courrier/media/courriers/${filePath.split('/').pop()}`;
        setFileUrl(fixedFileUrl);

        setCourrierDetails(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier transféré :', error);
        setError('Erreur lors de la récupération des détails du courrier transféré');
      }
    };

    fetchCourrierDetails();
  }, [id]);

  

  if (!courrierDetails) {
    return <p>Chargement...</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return '';  
    }
    return dateString.replace('T', ' ').replace('Z', '');
  };

  return (
    <div className="courrier-details">
  <div className="back-button">
  <button type="button" className="back-button" onClick={() => navigate('/AllCourrierTransferer')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>
      <h2 className="dashboard-title">Détails du Courrier Transféré</h2>
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
          <label htmlFor="date_envoi"><strong>Date de transfert</strong></label>
          <input type="text" id="date_envoi" value={formatDate(courrierDetails.date_envoi)} readOnly />
        </div>
      </div>

      <div className="line">
        <div className="input-group">
          <label htmlFor="Nbentrer"><strong>Numero Entite d'origine</strong></label>
          <input type="text" id="Nbentrer" value={courrierDetails.Nbentrer} readOnly />
        </div>
        <div className="input-group">
          <label htmlFor="entrer"><strong>Date d'arrivé</strong></label>
          <input 
    type="text" 
    value={courrierDetails.entrer ? courrierDetails.entrer.split('T')[0] : ''} 
    readOnly 
  />
        </div>
      </div>

      <div className="line">
        <div className="input-group">
          <label htmlFor="support"><strong>Support</strong></label>
          <input type="text" id="support" value={courrierDetails.support} readOnly />
        </div>
        <div className="input-group">
          <label htmlFor="etablissment"><strong>Etablissment</strong></label>
          <input type="text" id="etablissment" value={formatDate(courrierDetails.etablissment)} readOnly />
        </div>
      </div>

      <div className="line">
        <div className="input-group">
          <label htmlFor="utilisateur_usernames"><strong>Transféré à</strong></label>
          <input type="text" id="utilisateur_usernames" value={courrierDetails.utilisateur_usernames} readOnly />
        </div>
        <div className="input-group">
          <label htmlFor="raison"><strong>Raison</strong></label>
          <input type="text" id="raison" value={courrierDetails.raison} readOnly />
        </div>
      </div>

      <div className="input-group">
  <label htmlFor="commentaire"><strong>Commentaire</strong></label>
  <textarea
    id="commentaire"
    value={courrierDetails.commentaire}
    readOnly
    rows="4" // Adjust the number of rows as needed
    style={{ resize: 'none' }} // Prevent resizing if desired
  />
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
          <input type="text" id="nombrePiecesJointes" value={courrierDetails.nombre_pieces_jointes} readOnly />
        </div>
      </div>

     

     
    </div>
  );
};


export default DetailsCourrierTransferer;
