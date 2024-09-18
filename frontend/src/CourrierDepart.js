/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './CourriersDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Alert from './Alert';

const CourrierDepart = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [department, setDepartment] = useState('');
  const [chiefs, setChiefs] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    incremented_number: '',
    sortie: '',
    traitePar: '',
    signePar: '',
    groupeEtablissement: '',
    destinerA: '',
    objet: '',
    fichier: null,
    nombrePiecesJointes: 1,
    destinerAId: '',
    Datedentrer: '',
    Numberdentrer: '',
  });
  const [filePreview, setFilePreview] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd'T'HH:mm:ss"); // Correct datetime-local format
    setCurrentDate(formattedDate);

    // Retrieve user ID and username from local storage
    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }

    const usernameFromStorage = localStorage.getItem('username');
    if (usernameFromStorage) {
      setUsername(usernameFromStorage);
    }

    // Fetch chiefs and users from the backend
    fetchChiefsAndUsers();

    // Fetch the incremented number for the courrier
    fetchIncrementedNumber();
  }, []);

  const fetchChiefsAndUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/Courrier/users/');
      const data = await response.json();
      const chiefs = data.filter(user => user.role === 'chef');
      setChiefs(chiefs);
      setUsers(data);

      if (chiefs.length === 1) {
        const singleChief = chiefs[0];
        setFormData(prevFormData => ({
          ...prevFormData,
          traitePar: singleChief.username,
          signePar: singleChief.username,
          destinerA: singleChief.username,
          destinerAId: singleChief.id,
          groupeEtablissement: singleChief.department,
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  const fetchIncrementedNumber = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/Courrier/next_incremented_number/');
      const data = await response.json();
      setFormData(prevFormData => ({
        ...prevFormData,
        incremented_number: data.incremented_number
      }));
    } catch (error) {
      console.error('Error fetching incremented number:', error);
    }
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    setFormData({ ...formData, fichier: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    setInvalidFields([]);

    const requiredFields = ['incremented_number', 'traitePar', 'signePar', 'groupeEtablissement', 'destinerA', 'objet', 'fichier'];
    const invalidFields = requiredFields.filter(field => !formData[field]);
    if (invalidFields.length > 0) {
      setInvalidFields(invalidFields);
      setAlertMessage('Veuillez remplir tous les champs obligatoires.');
      setAlertType('error');
      return;
    }

    const data = new FormData();
    data.append('incremented_number', formData.incremented_number);
    data.append('sortie', formData.sortie || currentDate);
    data.append('traitePar', formData.traitePar);
    data.append('signePar', formData.signePar);
    data.append('groupeEtablissement', formData.groupeEtablissement || department);
    data.append('destinerA', formData.destinerA);
    data.append('destinerAId', formData.destinerAId);
    data.append('objet', formData.objet);
    data.append('fichier', formData.fichier);
    data.append('nombrePiecesJointes', formData.nombrePiecesJointes);
    data.append('utilisateur', userId);
    data.append('Datedentrer', formData.Datedentrer);           // Append new date field
    data.append('Numberdentrer', formData.Numberdentrer);  

    fetch('http://127.0.0.1:8000/api/Courrier/envoyer/', {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Courrier envoyé avec succès:', data);

        setAlertMessage('Courrier envoyé avec succès !');
        setAlertType('success');
        
        navigate('/All_CourrierDepart');
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du courrier:', error);
        setAlertMessage('Erreur lors de l\'envoi du courrier.');
        setAlertType('error');
      });
  };

  return (
    <div className="form-container_depart">
 <div className="back-button">
  <button type="button" className="back-button" onClick={() => navigate('/All_CourrierDepart')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>

    <h2 className="dashboard-title">Nouveau Courrier de départ </h2>
    <form onSubmit={handleSubmit}>
      
        <div className="form">
          <div className="form-row">
          
            <div className={`form-group ${invalidFields.includes('incremented_number') ? 'invalid-field' : ''}`}>
              <label htmlFor="incremented_number" color='rgb(8, 174, 106, 0.8)'>Numéro </label>
              <input
                type="text"
                id="incremented_number"
                name="incremented_number"
                value={formData.incremented_number}
                onChange={handleInputChange}
                readOnly
              />
            
            </div>
            <div className='form-group'>
              <label htmlFor="sortie">Sortie le </label>
              <input
                type="datetime-local"
                id="sortie"
                name="sortie"
                value={formData.sortie || currentDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group ${invalidFields.includes('traitePar') ? 'invalid-field' : ''}`}>
              <label htmlFor="traitePar">Traité par </label>
              <input
                type="text"
                id="traitePar"
                name="traitePar"
                value={formData.traitePar}
                readOnly
              />
            </div>
            <div className={`form-group ${invalidFields.includes('signePar') ? 'invalid-field' : ''}`}>
              <label htmlFor="signePar">Signé par </label>
              <input
                type="text"
                id="signePar"
                name="signePar"
                value={formData.signePar}
                readOnly
              />
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group ${invalidFields.includes('groupeEtablissement') ? 'invalid-field' : ''}`}>
              <label htmlFor="groupeEtablissement">Groupe d'établissements </label>
              <input
                type="text"
                id="groupeEtablissement"
                name="groupeEtablissement"
                value={formData.groupeEtablissement}
                readOnly
              />
            </div>
            <div className={`form-group ${invalidFields.includes('destinerA') ? 'invalid-field' : ''}`}>
              <label htmlFor="destinerA">Destiné à </label>
              <input
                type="text"
                id="destinerA"
                name="destinerA"
                value={formData.destinerA}
                readOnly
              />
            </div>
          </div>
        
      
      
        <div className="form-row">
          <div className={`form-group ${invalidFields.includes('objet') ? 'invalid-field' : ''}`}>
            <label htmlFor="objet">Objet </label>
            <input
              type="text"
              id="objet"
              name="objet"
              value={formData.objet}
              onChange={handleInputChange}
            />
          </div>
        </div>
      
      
        <div className="form-row">
          <div className={`form-group ${invalidFields.includes('fichier') ? 'invalid-field' : ''}`}>
            <label htmlFor="fichier">Fichier </label>
            <input
              type="file"
              id="fichier"
              name="fichier"
              className="input-file"
              onChange={handleFileChange}
            />
            
          </div>
          <div className={`form-group ${invalidFields.includes('nombrePiecesJointes') ? 'invalid-field' : ''}`}>
            <label htmlFor="nombrePiecesJointes">Nombre de pièces jointes </label>
            <input
              type="number"
              id="nombrePiecesJointes"
              name="nombrePiecesJointes"
              min="1"
              value={formData.nombrePiecesJointes}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className={`form-group ${invalidFields.includes('Datedentrer') ? 'invalid-field' : ''}`}>
            <label htmlFor="newDate">Nouvelle Date </label>
            <input
              type="date"
              id="newDate"
              name="newDate"
              value={formData.Datedentrer}
              onChange={handleInputChange}
            />
          </div>
          <div className={`form-group ${invalidFields.includes('Numberdentrer') ? 'invalid-field' : ''}`}>
            <label htmlFor="newNumber">Nouveau Numéro </label>
            <input
              type="number"
              id="newNumber"
              name="newNumber"
              value={formData.Numberdentrer}
              onChange={handleInputChange}
            />
          </div>
        </div>

        </div>
      {alertMessage && <Alert type={alertType} message={alertMessage} />}
      <div className="form-actions">
        <button type="submit">Envoyer</button>
      </div>
    </form>
  </div>
);
};





export default CourrierDepart;










 */



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import './CourriersDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Alert from './Alert';
import swal from 'sweetalert';

const CourrierDepart = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [chiefs, setChiefs] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [suport, setSuport] = useState('');
  const [suports, setSuports] = useState([]);
  const [error, setError] = useState('');
  const [destinataires, setDestinataires] = useState([]);
  const [selectedDestinataires, setSelectedDestinataires] = useState([]);
  const [formData, setFormData] = useState({
    incremented_number: '',
    sortie: '',
    department: '',
    suport:'',
    
    objet: '',
    fichier: null,
    nombrePiecesJointes: 1,
    destinerAId: '',
    entrer:'',
    Nbentrer:'',
    destinataires:''
  });

  const [filePreview, setFilePreview] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [etablissementTypes, setEtablissementTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd'T'HH:mm:ss"); // Correct datetime-local format
    setCurrentDate(formattedDate);

    // Retrieve user ID and username from local storage
    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }

    const usernameFromStorage = localStorage.getItem('username');
    if (usernameFromStorage) {
      setUsername(usernameFromStorage);
    }

    // Fetch chiefs and users from the backend
    

    // Fetch the incremented number for the courrier
    fetchIncrementedNumber();
    fetchEstablishmentTypes();
    fetchSuport();
    fetchDestinataires();
    

  }, []);

  

  const fetchIncrementedNumber = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/Courrier/next_incremented_number/');
      const data = await response.json();
      setFormData(prevFormData => ({
        ...prevFormData,
        incremented_number: data.incremented_number
      }));
    } catch (error) {
      console.error('Error fetching incremented number:', error);
    }
  };

  const fetchSuport = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/Courrier/suport/');
        const data = await response.json();
        setSuports(data);
    } catch (error) {
        console.error('Error fetching establishment types:', error);
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

  const fetchEstablishmentTypes = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/Courrier/establishment_types/');
        const data = await response.json();
        setEtablissementTypes(data);
    } catch (error) {
        console.error('Error fetching establishment types:', error);
    }
};

const handleTypeChange = async (event) => {
  const type = event.target.value;
  setSelectedType(type);

  if (type) {
      try {
          const response = await fetch(`http://127.0.0.1:8000/api/Courrier/departments/${type}/`);
          const data = await response.json();
          setDepartments(data);
      } catch (error) {
          console.error('Error fetching departments:', error);
      }
  } else {
    setDepartments([]);
  }
};

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepartmentChange = event => {
    const selectedDepartment = event.target.value;
    setDepartment(selectedDepartment);
    setFormData(prevFormData => ({
      ...prevFormData,
      department: selectedDepartment
    }));
  };
  const handleFileChange = event => {
    const file = event.target.files[0];
    setFormData({ ...formData, fichier: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
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

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    setInvalidFields([]);

    const requiredFields = ['incremented_number', 'objet', 'fichier', 'entrer', 'Nbentrer', 'department', 'suport'];
    const invalidFields = requiredFields.filter(field => !formData[field]);
    
    if (invalidFields.length > 0 || selectedDestinataires.length === 0) {
      setInvalidFields(invalidFields);
      setAlertMessage('Veuillez remplir tous les champs obligatoires.');
      setAlertType('error');
      return;
    }

    console.log('Département:', formData.department);
    console.log('Support:', formData.suport);
    console.log('FormData:', formData);

    const data = new FormData();
    data.append('incremented_number', formData.incremented_number);
    data.append('sortie', formData.sortie || currentDate);
    data.append('objet', formData.objet);
    data.append('fichier', formData.fichier);
    data.append('nombrePiecesJointes', formData.nombrePiecesJointes);
    data.append('utilisateur', userId);
    data.append('etablissment', formData.department);
    data.append('support', formData.suport);
    data.append('entrer', formData.entrer);
    data.append('Nbentrer', formData.Nbentrer);
    data.append('destinataires', JSON.stringify(selectedDestinataires));

  console.log('Destinataires:', destinataires);
console.log('Selected Destinataires:', selectedDestinataires);
    // Convertir les IDs sélectionnés en noms d'utilisateur
const selectedUsernames = selectedDestinataires.map(destinataireId => {
  const user = destinataires.find(d => d.user_id === destinataireId);
  console.log('Finding user with ID:', destinataireId, 'Found user:', user); // Debug log
  return user ? user.username : destinataireId;  // Affiche le nom d'utilisateur si trouvé, sinon affiche l'ID
});

console.log('Selected Usernames:', selectedUsernames);

    const confirmDelete = () => {
      const message = `
    Objet: ${formData.objet} 
    Destinataires: ${selectedUsernames.join(', ')}
    
`;
        swal({
          title: "Voulez-vous vraiment envoyer ce courrier ?",
          text:  message,
          icon: "warning",
          buttons: ["Annuler", "Envoyer"],
          dangerMode: true,
      }).then((willSend) => {
        if (willSend) {
          fetch('http://127.0.0.1:8000/api/Courrier/envoyer/', {
            method: 'POST',
            body: data,  // Assuming `data` is already defined
          })
          .then(response => response.json())
          .then(result => {
            console.log('Courrier envoyé avec succès:', result);
            setAlertMessage('Courrier envoyé avec succès !');
            setAlertType('success');
            navigate('/All_CourrierDepart');
          })
          .catch(error => {
            console.error('Erreur lors de l\'envoi du courrier:', error);
            setAlertMessage('Erreur lors de l\'envoi du courrier.');
            setAlertType('error');
          });
        }
      });
    };
    
    confirmDelete();
  };
  
  

  return (
    <div className="form-container_depart">
 <div className="back-button">
  <button type="button" className="back-button" onClick={() => navigate('/All_CourrierDepart')}>
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
  </div>

    <h2 className="dashboard-title">Nouveau Courrier de Arrivée </h2>
    <form onSubmit={handleSubmit}>
      
        <div className="form">

        <div className="form-row">
          <div className={`form-group ${invalidFields.includes('entrer') ? 'invalid-field' : ''}`}>
            <label htmlFor="entrer">Arrivée le </label>
            <input
              type="date"
              id="entrer"
              name="entrer"
              value={formData.entrer}
              onChange={handleInputChange}
            />
          </div>
          

          <div className={`form-group ${invalidFields.includes('Nbentrer') ? 'invalid-field' : ''}`}>
            <label htmlFor="Nbentrer">Numero Entite d'origine </label>
            <input
              type="number"
              id="Nbentrer"
              name="Nbentrer"
              value={formData.Nbentrer}
              onChange={handleInputChange}
            />
          </div>
          </div>
          <div className="form-row">
            <div className={`form-group ${invalidFields.includes('incremented_number') ? 'invalid-field' : ''}`}>
              <label htmlFor="incremented_number" color='rgb(8, 174, 106, 0.8)'>Numéro </label>
              <input
                type="text"
                id="incremented_number"
                name="incremented_number"
                value={formData.incremented_number}
                onChange={handleInputChange}
                readOnly
              />
            
            </div>
            <div className='form-group'>
              <label htmlFor="sortie">Date</label>
              <input
                type="datetime-local"
                id="sortie"
                name="sortie"
                value={formData.sortie || currentDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">

<div className="form-group">
  <label htmlFor="etablissementType">Groupe Etablissement</label>
  <select id="etablissementType" value={selectedType} onChange={handleTypeChange} className="support">
    <option value="">Select groupe etablissement</option>
    {etablissementTypes.map(type => (
      <option key={type} value={type}>{type}</option>
    ))}
  </select>
</div>
{departments.length > 0 && (
  <div className={`form-group ${invalidFields.includes('department') ? 'invalid-field' : ''}`}>
    <label htmlFor="departments">Etablissement</label>
    <select id="departments" value={department} onChange={handleDepartmentChange} className="support">
      <option value="">Sélectionner un etablisement</option>
      {departments.map(department => (
        <option key={department.id} value={department.nom}>{department.nom}</option>
      ))}
    </select>
  </div>
)}
</div>
<div className="form-row">
<div className={`form-group ${invalidFields.includes('suport') ? 'invalid-field' : ''}`}>
    <label htmlFor="support">Support</label>
    <select
      id="suport"
      name="suport"
      value={formData.suport}
      className="support"
      onChange={handleInputChange}
    >
      <option value="">Sélectionner un support</option>
      {suports.map(suport => (
        <option key={suport.id} value={suport.id}>
          {suport.suport}
        </option>
      ))}
    </select>
  </div>
  </div>  
      
        <div className="form-row">
          <div className={`form-group ${invalidFields.includes('objet') ? 'invalid-field' : ''}`}>
            <label htmlFor="objet">Objet </label>
            <input
              type="text"
              id="objet"
              name="objet"
              value={formData.objet}
              onChange={handleInputChange}
            />
          </div>
        </div>
      
      
        <div className="form-row">
          <div className={`form-group ${invalidFields.includes('fichier') ? 'invalid-field' : ''}`}>
            <label htmlFor="fichier">Fichier </label>
            <input
              type="file"
              id="fichier"
              name="fichier"
              className="input-file"
              onChange={handleFileChange}
            />
            
          </div>
          <div className={`form-group ${invalidFields.includes('nombrePiecesJointes') ? 'invalid-field' : ''}`}>
            <label htmlFor="nombrePiecesJointes">Nombre de pièces jointes </label>
            <input
              type="number"
              id="nombrePiecesJointes"
              name="nombrePiecesJointes"
              min="1"
              value={formData.nombrePiecesJointes}
              onChange={handleInputChange}
            />
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
              {destinataire.username} - {destinataire.fonction}
            </label>
          ))}
        </div>
      </div>
        </div>
      {alertMessage && <Alert type={alertType} message={alertMessage} />}
      <div className="form-actions">
        <button type="submit">Envoyer</button>
      </div>
    </form>
  </div>
);
};


export default CourrierDepart;






