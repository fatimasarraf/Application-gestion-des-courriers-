import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './CourriersDepart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Alert from './Alert';
import swal from 'sweetalert';

const Courrier = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  
  const [chiefs, setChiefs] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [suport, setSuport] = useState('');
  const [suports, setSuports] = useState([]);
  const [formData, setFormData] = useState({
    incremented_number: '',
    sortie: '',
    traitePar: '',
    signePar: '',
    department: '',
    suport:'',
    objet: '',
    fichier: null,
    nombrePiecesJointes: 1,
    
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
    fetchChiefsAndUsers();

    // Fetch the incremented number for the courrier
    fetchIncrementedNumber();
    fetchEstablishmentTypes();
    fetchSuport();
  }, []);

  const fetchChiefsAndUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/Courrier/users/');
      const data = await response.json();
      const roles = ['chef', 'vicepresident', 'responsableservice','responsablePôle', 'secretairegeneral', 'chefservice', 'chefdivision'];
      const filteredUsers = data.filter(user => roles.includes(user.role));
      setUsers(filteredUsers);

      if (filteredUsers.length === 1) {
        const singleUser = filteredUsers[0];
        setFormData(prevFormData => ({
          ...prevFormData,
          traitePar: singleUser.code,
          signePar: singleUser.code,
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchIncrementedNumber = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/Courrier/Courrier_incremented_number/');
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

  const handleSubmit = event => {
    event.preventDefault();

    setInvalidFields([]);

    const requiredFields = ['incremented_number', 'traitePar', 'signePar','suport', 'objet', 'fichier'];
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
    data.append('etablissment', formData.department);
   
    data.append('objet', formData.objet);
    data.append('fichier', formData.fichier);
    data.append('nombrePiecesJointes', formData.nombrePiecesJointes);
    data.append('utilisateur', userId);
    data.append('support', formData.suport);

    
      const confirmDelete = () => {
        const message = `
    Objet: ${formData.objet}    
    Signé par: ${formData.signePar}
    Traité par: ${formData.traitePar}
    Destiner à: ${department}`;
        swal({
          title: "Voulez-vous vraiment envoyer ce courrier ?",
          text:  message,
          icon: "warning",
          buttons: ["Annuler", "Envoyer"],
          dangerMode: true,
        }).then((willSend) => {
          if (willSend) {
            fetch('http://127.0.0.1:8000/api/Courrier/envoyer_courrier/', {
              method: 'POST',
              body: data,
            })
            .then(response => response.json())
            .then(data => {
              console.log('Courrier envoyé avec succès:', data);
      
              setAlertMessage('Courrier envoyé avec succès !');
              setAlertType('success');
              
              navigate('/All_Courrier');
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
              <label htmlFor="traitePar">Traité par</label>
              <select
                id="traitePar"
                name="traitePar"
                className="support"
                value={formData.traitePar}
                onChange={handleInputChange}
              >
                <option value="">Sélectionner</option>
                {users.map(user => (
                  <option key={user.id} value={user.code}>
                    {user.code}-{user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className={`form-group ${invalidFields.includes('signePar') ? 'invalid-field' : ''}`}>
            <label htmlFor="signePar">Signé par</label>
              <select
                id="signePar"
                name="signePar"
                className="support"
                value={formData.signePar}
                onChange={handleInputChange}
              >
                <option value="">Sélectionner</option>
                {users.map(user => (
                  <option key={user.id} value={user.code}>
                    {user.code}-{user.username}
                  </option>
                ))}
              </select>
            </div>

            
          </div>
          
          <div className="form-row">
          <div className="form-group">
    <label htmlFor="etablissementType">Groupe Etablissement</label>
    <select id="etablissementType" value={selectedType} onChange={handleTypeChange} className="support">
      <option value="">Select</option>
      {etablissementTypes.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>
  </div>
  {departments.length > 0 && (
    <div className={`form-group ${invalidFields.includes('department') ? 'invalid-field' : ''}`}>
      <label htmlFor="departments">Destiner à</label>
      <select id="departments" value={department} onChange={handleDepartmentChange} className="support">
        <option value="">Select</option>
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
        </div>
      {alertMessage && <Alert type={alertType} message={alertMessage} />}
      <div className="form-actions">
        <button type="submit">Envoyer</button>
      </div>
    </form>
  </div>
);
};


export default Courrier;








