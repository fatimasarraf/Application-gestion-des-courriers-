/* import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourrierTransferer.css'

const CourrierTransferer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [numeroBureauOrdre, setNumeroBureauOrdre] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [raison, setRaison] = useState('');
  const [raisons, setRaisons] = useState([]);
  const [error, setError] = useState('');
  const [destinataires, setDestinataires] = useState([]);
  const [selectedDestinataires, setSelectedDestinataires] = useState([]);
  const [dateEnvoi, setDateEnvoi] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-Details-recus/${id}/`);
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Erreur lors de la récupération des détails du courrier reçu: ${errorDetails}`);
        }
        const data = await response.json();
        setCourrierDetails(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier reçu :', error);
        setError(error.message);
      }
    };

    const fetchRaisons = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/Courrier/reasons/');
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Erreur lors de la récupération des raisons de transfert: ${errorDetails}`);
        }
        const data = await response.json();
        setRaisons(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des raisons de transfert :', error);
        setError(error.message);
      }
    };

    const fetchDestinataires = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/department_services_and_users_by_user/${localStorage.getItem('user_id')}/`);
        setDestinataires(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des destinataires:', error);
        setError('Erreur lors de la récupération des destinataires');
      }
    };

    fetchCourrierDetails();
    fetchRaisons();
    fetchDestinataires();

    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    setDateEnvoi(`${currentDate}T${currentTime}`);
  }, [id]);

  const fetchFileContent = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000${courrierDetails.fichier}`);
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Erreur lors de la récupération du fichier: ${errorDetails}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = courrierDetails.fichier.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de la récupération du fichier :', error);
      setError(error.message);
    }
  };

  const handleTransfer = async () => {
    try {
      console.log('Destinataires sélectionnés:', selectedDestinataires);
      const formData = {
        
        dateEnvoi: dateEnvoi,
        user_id: localStorage.getItem('user_id'),
        destinataires: selectedDestinataires,
      };

      setInvalidFields([]);
      
      
    const requiredFields = ['commentaire', 'raison', 'destinataires'];
    const invalidFields = requiredFields.filter(field => !formData[field]);
    if (invalidFields.length > 0) {
      setInvalidFields(invalidFields);
      setError('Veuillez remplir tous les champs obligatoires.');
      setAlertType('error');
      return;
    }

  
      console.log('Données du formulaire avant envoi:', formData);
      console.log(`URL courriers-Depart: http://127.0.0.1:8000/api/Courrier/courriers-Depart/${id}/`);
      const responseCourrierDepart = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-Depart/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!responseCourrierDepart.ok) {
        const errorDetails = await responseCourrierDepart.text();
        throw new Error(`Erreur lors de la création du courrier départ : ${errorDetails}`);
      }

      const transferData = {
        commentaire: commentaire,
        raison: raison,
        date_envoi: dateEnvoi,
        user_id: localStorage.getItem('user_id'),
        destinataires: selectedDestinataires,
        
      };
      console.log('Données de transfert avant envoi:', transferData);
      console.log(`URL transfers: http://127.0.0.1:8000/api/Courrier/transfers/${id}/`);
      const responseTransfer = await fetch(`http://127.0.0.1:8000/api/Courrier/transfers/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });

      if (!responseTransfer.ok) {
        const errorDetails = await responseTransfer.text();
        throw new Error(`Erreur lors de la création du transfert : ${errorDetails}`);
      }

      navigate('/AllCourrierTransferer'); // Redirection après un transfert réussi
    } catch (error) {
      console.error('Erreur lors du transfert du courrier :', error);
      setError(error.message);
    }
  };

  const handleDestinataireChange = (destinataireId, checked) => {
    let updatedSelectedDestinataires;
    if (checked) {
      updatedSelectedDestinataires = [...selectedDestinataires, destinataireId];
    } else {
      updatedSelectedDestinataires = selectedDestinataires.filter(id => id !== destinataireId);
    }
    setSelectedDestinataires(updatedSelectedDestinataires);
    console.log('Destinataires sélectionnés:', updatedSelectedDestinataires);
  };

  if (!courrierDetails) {
    return <p>Chargement...</p>;
  }
  
  return (
    <div className="courrier-transferer" style={{  maxHeight: 'calc(100vh - 200px)' }}>
  <h2 className="dashboard-title">Transférer le Courrier</h2>
  {error && <p style={{ color: 'red' }}>{error}</p>}

  <div className="input-row-transferer">
    <div className="courrier-transferer">
      <label>
        <p><strong>Numéro</strong></p>
        <input type="text" value={courrierDetails.numero} disabled />
      </label>

      <label>
        <p><strong>Date de réception</strong></p>
        <input type="text" value={new Date(courrierDetails.sortie).toLocaleDateString('fr-FR')} disabled />
      </label>
    </div>
  </div>

  <div className="input-row-transferer">
    <div className="courrier-transferer">
      <label>
        <p><strong>Traité par</strong> </p>
        <input type="text" value={courrierDetails.traitePar} disabled />
      </label>

      <label>
        <p><strong>Signé par</strong></p>
        <input type="text" value={courrierDetails.signePar} disabled />
      </label>
    </div>
  </div>

  <div className="input-row-transferer">
    <div className="courrier-transferer">
      <label>
        <p><strong>Emetteur</strong> </p>
        <input type="text" value={courrierDetails.utilisateur_username} disabled />
      </label>

      <label>
      <p><strong>Nombre de pièces jointes</strong></p>
        <input type="text" value={courrierDetails.nombrePiecesJointes} disabled />
      </label>
    </div>
  </div>
  <div className="transferer">
  <div className="input-row-transferer">
    <div className="courrier-transferer">
      <label>
        <p><strong>Objet</strong> </p>
        <input type="text" value={courrierDetails.objet} disabled />
      </label>
      </div>
      </div>
      <div className="transferer">
        <div className="input-row-transferer">
    <div className="courrier-transferer">
      <label>
        <p><strong>Fichier</strong></p>
        <input type="text" value={courrierDetails.fichier.split('/').pop()} disabled />
        <span onClick={fetchFileContent} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
        </span>
      </label>
      </div>
      </div>
    </div>
  </div>

  <div className={`courrier-transferer-form ${invalidFields.includes('commentaire') ? 'invalid-field' : ''}`}>
  <label>Commentaire</label>
  <div className="textarea-container">
    <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)}></textarea>
  </div>
</div>

<div className={`courrier-transferer-form ${invalidFields.includes('raison') ? 'invalid-field' : ''}`}>
  <label>Raison du Transfert:</label>
  <div className="select-container">
    <select value={raison} onChange={(e) => setRaison(e.target.value)}>
      <option value="">Sélectionnez une raison</option>
      {raisons.map((raison) => (
        <option key={raison.id} value={raison.id}>{raison.reason}</option>
      ))}
    </select>
  </div>
</div>

<div className={`courrier-transferer-form ${invalidFields.includes('destinataires') ? 'invalid-field' : ''}`}>
  <label>Destinataires</label>
  <div className="checkbox-container">
    {destinataires.map((destinataire) => (
      <label key={destinataire.id}>
        <input
          type="checkbox"
          value={destinataire.id}
          onChange={(e) => handleDestinataireChange(destinataire.user_id, e.target.checked)}
          style={{ backgroundColor: 'black' }}
        />
        {destinataire.username} - {destinataire.service_name}
      </label>
    ))}
  </div>
</div>


  <div className="input-row-transferer">
    <button onClick={handleTransfer}>Transférer</button>
  </div>
</div>



  );
};

export default CourrierTransferer;
 */


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourrierTransferer.css';
import { format } from 'date-fns';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';


const CourrierTransferer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrierDetails, setCourrierDetails] = useState(null);
  const [numeroBureauOrdre, setNumeroBureauOrdre] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [raison, setRaison] = useState('');
  const [raisons, setRaisons] = useState([]);
  const [error, setError] = useState('');
  const [destinataires, setDestinataires] = useState([]);
  const [selectedDestinataires, setSelectedDestinataires] = useState([]);
  const [dateEnvoi, setDateEnvoi] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [alertType, setAlertType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  useEffect(() => {
    const fetchCourrierDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-Details-recus/${id}/`);
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Erreur lors de la récupération des détails du courrier reçu: ${errorDetails}`);
        }
        const data = await response.json();
        
        const filePath = data.fichier; // Le chemin du fichier reçu de l'API
        const fixedFileUrl = `http://127.0.0.1:8000/api/Courrier/media/courriers/${filePath.split('/').pop()}`;
        setFileUrl(fixedFileUrl);

        setCourrierDetails(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du courrier reçu :', error);
        setError(error.message);
      }
    };

    const fetchRaisons = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/Courrier/reasons/');
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Erreur lors de la récupération des raisons de transfert: ${errorDetails}`);
        }
        const data = await response.json();
        setRaisons(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des raisons de transfert :', error);
        setError(error.message);
      }
    };

    const fetchDestinataires = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/department_services_and_users_by_user/${localStorage.getItem('user_id')}/`);
        setDestinataires(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des destinataires:', error);
        setError('Erreur lors de la récupération des destinataires');
      }
    };

    fetchCourrierDetails();
    fetchRaisons();
    fetchDestinataires();

    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    setDateEnvoi(`${currentDate}T${currentTime}`);
  }, [id]);

  
  const handleTransfer = async () => {
    try {
      const formData = {
        dateEnvoi: dateEnvoi,
        commentaire: commentaire,
        raison: raison,
        user_id: localStorage.getItem('user_id'),
        destinataires: selectedDestinataires,
      };

      const requiredFields = ['commentaire', 'raison', 'destinataires'];
      const invalidFields = requiredFields.filter(field => !formData[field] || formData[field].length === 0);
      
      if (invalidFields.length > 0) {
        setInvalidFields(invalidFields);
        setErrorMessage('Veuillez remplir tous les champs.');
        setAlertType('error');
        return;
      }


      
    /* const confirmDelete = window.confirm("Êtes-vous sûr de vouloir envoyer ce courrier ?");
    if (confirmDelete) {
      const responseCourrierDepart = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-Depart/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });


      if (!responseCourrierDepart.ok) {
        const errorDetails = await responseCourrierDepart.text();
        throw new Error(`Erreur lors de la création du courrier départ : ${errorDetails}`);
      }

      const transferData = {
        commentaire: commentaire,
        raison: raison,
        date_envoi: dateEnvoi,
        user_id: localStorage.getItem('user_id'),
        destinataires: selectedDestinataires,
      };
      
      const responseTransfer = await fetch(`http://127.0.0.1:8000/api/Courrier/transfers/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });

      if (!responseTransfer.ok) {
        const errorDetails = await responseTransfer.text();
        throw new Error(`Erreur lors de la création du transfert : ${errorDetails}`);
      }

      navigate('/AllCourrierTransferer');
    } */
      const selectedUsernames = selectedDestinataires.map(destinataireId => {
        const user = destinataires.find(d => d.user_id === destinataireId);
        console.log('Finding user with ID:', destinataireId, 'Found user:', user); // Debug log
        return user ? user.username : destinataireId;  // Affiche le nom d'utilisateur si trouvé, sinon affiche l'ID
      });

      const message = `
      Objet: ${courrierDetails.objet} 
      Transferer à: ${selectedUsernames.join(', ')}
      
  `;
      const confirmTransfer = await swal({
        
        title: "Êtes-vous sûr de vouloir transferer ce courrier ?",
        icon: "warning",
        text:  message,
        buttons: ["Annuler", "Confirmer"],
        dangerMode: true,
      });

      if (confirmTransfer) {
        try {
          const responseCourrierDepart = await fetch(`http://127.0.0.1:8000/api/Courrier/courriers-Depart/${id}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (!responseCourrierDepart.ok) {
            const errorDetails = await responseCourrierDepart.text();
            throw new Error(`Erreur lors de la création du courrier départ : ${errorDetails}`);
          }

          const transferData = {
            commentaire: commentaire,
            raison: raison,
            date_envoi: dateEnvoi,
            user_id: localStorage.getItem('user_id'),
            destinataires: selectedDestinataires,
          };

          const responseTransfer = await fetch(`http://127.0.0.1:8000/api/Courrier/transfers/${id}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transferData),
          });

          if (!responseTransfer.ok) {
            const errorDetails = await responseTransfer.text();
            throw new Error(`Erreur lors de la création du transfert : ${errorDetails}`);
          }

          navigate('/AllCourrierTransferer');
        } catch (error) {
          console.error('Erreur lors du transfert du courrier :', error);
          setError(error.message);
          await swal('Erreur', error.message, 'error');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la préparation du transfert :', error);
      setError(error.message);
      await swal('Erreur', error.message, 'error');
    }
  };

  const handleDestinataireChange = (destinataireId, checked) => {
    let updatedSelectedDestinataires;
    if (checked) {
      updatedSelectedDestinataires = [...selectedDestinataires, destinataireId];
    } else {
      updatedSelectedDestinataires = selectedDestinataires.filter(id => id !== destinataireId);
    }
    setSelectedDestinataires(updatedSelectedDestinataires);
    console.log('Destinataires sélectionnés:', updatedSelectedDestinataires);
  };

  if (!courrierDetails) {
    return <p>Chargement...</p>;
  }
  
  return (
    <div className="courrier-transferer" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="back-button-courrier-transferer">
  <button type="button" className="back-button-courrier-transferer" onClick={() => navigate('/courriers-recus')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>
      <h2 className="dashboard-title">Transférer le Courrier</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="input-row-transferer">
        <div className="courrier-transferer">
          <label>
            <p><strong>Numéro</strong></p>
            <input type="text" value={courrierDetails.numero} disabled />
          </label>

          <label>
            <p><strong>Date de réception</strong></p>
            <input type="text" value={new Date(courrierDetails.sortie).toLocaleDateString('fr-FR')} disabled />
          </label>
        </div>
      </div>

      <div className="input-row-transferer">
        <div className="courrier-transferer">
          <label>
            <p><strong>Date d'arrivé</strong> </p>
            <input type="text" id="entrer" value={new Date(courrierDetails.entrer).toLocaleDateString('fr-FR')} disabled />
          </label>

          <label>
            <p><strong>Numero Entite d'origine</strong></p>
            <input type="text" id="Nbentrer" value={courrierDetails.Nbentrer} readOnly />
          </label>
        </div>
      </div>

      <div className="input-row-transferer">
        <div className="courrier-transferer">
          <label>
            <p><strong>Support</strong> </p>
            <input type="text" id="support" value={courrierDetails.support} readOnly />
          </label>

          <label>
            <p><strong>Etablissment</strong></p>
            <input type="text" id="etablissment" value={courrierDetails.etablissment} readOnly />
          </label>
        </div>
      </div>

      <div className="input-row-transferer">
        <div className="courrier-transferer">
          <label>
            <p><strong>Emetteur</strong> </p>
            <input type="text" value={courrierDetails.utilisateur_username} disabled />
          </label>

          <label>
            <p><strong>Nombre de pièces jointes</strong></p>
            <input type="text" value={courrierDetails.nombrePiecesJointes} disabled />
          </label>
        </div>
      </div>

      <div className="transferer">
  <div className="input-row-transferer">
    <div className="courrier-transferer">
      <label>
        <p><strong>Objet</strong> </p>
        <input type="text" value={courrierDetails.objet} disabled />
      </label>
      </div>
      </div>
      <div className="transferer">
        <div className="input-row-transferer">
    <div className="courrier-transferer">
      <label>
        <p><strong>Fichier</strong></p>
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
      </label>
      </div>
      </div>
    </div>
  </div>


      <div className={`courrier-transferer-form ${invalidFields.includes('commentaire') ? 'invalid-field' : ''}`}>
        <label>Commentaire</label>
        <div className="textarea-container">
          <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)}></textarea>
        </div>
      </div>

      <div className={`courrier-transferer-form ${invalidFields.includes('raison') ? 'invalid-field' : ''}`}>
        <label>Raison du Transfert</label>
        <div className="select-container">
          <select value={raison} onChange={(e) => setRaison(e.target.value)}>
            <option value="">Sélectionnez une raison</option>
            {raisons.map((raison) => (
              <option key={raison.id} value={raison.id}>{raison.reason}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`courrier-transferer-form ${invalidFields.includes('destinataires') ? 'invalid-field' : ''}`}>
        <label>Transferer à</label>
        <div className="checkbox-container">
          {destinataires.map((destinataire) => (
            <label key={destinataire.id}>
              <input
                type="checkbox"
                value={destinataire.id}
                onChange={(e) => handleDestinataireChange(destinataire.user_id, e.target.checked)}
                style={{ backgroundColor: 'black' }}
              />
              {destinataire.username} - {destinataire.fonction}
            </label>
          ))}
        </div>
      </div>

      <div className="input-row-transferer">
        <button onClick={handleTransfer}>Transférer</button>
        {errorMessage && <div className="error-message-transferer-courrier">{errorMessage}</div>} {/* Display error message here */}
      </div>
    </div>
  );
};

export default CourrierTransferer;
