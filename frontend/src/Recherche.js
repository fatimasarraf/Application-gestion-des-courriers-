/* import React, { useState } from 'react';
import './recherche.css';

export default function Recherche() {
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const items = [
        { id: 'archives', label: 'Courrier Archives' },
        { id: 'departs', label: 'Courrier Départs' },
        { id: 'arrives', label: 'Courrier Arrivés' }
    ];

    // Fonction pour ouvrir la liste déroulante et réinitialiser l'entrée
    const handleInputClick = () => {
        setInputValue('');
        setIsDropdownOpen(true);
    };

    // Fonction pour gérer la sélection d'une option
    const handleOptionClick = (item) => {
        setInputValue(item.label);
        setSelectedOption(item.id);
        setIsDropdownOpen(false);
    };

    // Fonction pour filtrer les options basées sur l'entrée de l'utilisateur
    const filteredItems = items.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()));

    return (
        <div>
            <h1 className="title_recherche">Recherche</h1>
            <div style={{ position: 'relative' }} className="recherche-container">
                <input
                    type="text"
                    value={inputValue}
                    onClick={handleInputClick} // Ouvrir la liste déroulante au clic et réinitialiser l'entrée
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsDropdownOpen(true); // Garder la liste déroulante ouverte lors de la modification de l'entrée
                    }}
                    placeholder="Sélectionnez une option"
                />
                {isDropdownOpen && (
                    <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        width: '100%',
                        border: '1px solid #ddd',
                        padding: '0',
                        margin: '0',
                        listStyleType: 'none',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        zIndex: 1
                    }}>
                        {filteredItems.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleOptionClick(item)}
                                style={{
                                    padding: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedOption === item.id ? '#ddd' : '#fff'
                                }}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedOption && (
                <div>
                    <h2>Option sélectionnée:</h2>
                    <p>{items.find(item => item.id === selectedOption)?.label}</p>
                </div>
            )}
        </div>
    );
}
 */


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import './recherche.css';





import { format } from 'date-fns';

const Recherche = () => {
  const [type, setType] = useState('courriers-depart');
  const [types, setTypes] = useState('courriers-recus');
  const [searchTerm, setSearchTerm] = useState('');

  const [date, setDate] = useState('');
  const [entryNumber, setEntryNumber] = useState('');
  const [numero, setNumero] = useState('');
  const [etablissment, setEtablissment] = useState('');
  const [results, setResults] = useState([]);
  const [result, setResult] = useState([]);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const roleFromStorage = localStorage.getItem('role');
        if (roleFromStorage) {
            setRole(roleFromStorage);
            console.log(`Role: ${roleFromStorage}`);
        }

   
      
  }, []);

  const handleSearch = async () => {
    setSearchPerformed(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/${type}/search/`, {
        params: {
          objet: searchTerm,
          date: date,
          entryNumber: entryNumber,
          numero: numero,
          etablissment: etablissment,
          user_id: userId
        }
      });

      console.log('API response data:', response.data); // Log the response data
      setResults(response.data.results); // Set the results from the response
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    
  };


  const handleSearchrecus = async () => {
    setSearchPerformed(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/Courrier/${types}/search_recus_transfer/`, {
        params: {
          objet: searchTerm,
          date: date,
          entryNumber: entryNumber,
          numero: numero,
          etablissment: etablissment,
          user_id: userId
        }
      });

      console.log('API response data:', response.data); // Log the response data
      setResult(response.data.results); // Set the results from the response
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    
  };

  const handleItemClick = (id) => {
    // Navigate to the appropriate detail page based on the type
    const detailPage = type === 'courriers-depart'
      ? `/DetailsCourrierDepart/${id}`
      : type === 'courriers-archives'
      ? `/DetailsCourrierArchiver/${id}`
      : `/DetailsCourrier/${id}`;

    navigate(detailPage);
  };

  const handleItemrecusClick = (id) => {
    // Navigate to the appropriate detail page based on the type
    const detailPage = types === 'courriers-recus'
      ? `/DetailsCourrierRecus/${id}`
      
      : `/DetailsCourrierTransferer/${id}`;

    navigate(detailPage);
  };

  return (
    
<div className="recherche-scroll-container">
    {role === 'Admin' && (
        
        
    <div  className="recherche-container">
        <div  className="recherche-form">
        <div className="input-group_recherche">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="courriers-depart">Courriers Arrives</option>
        <option value="courriers-archives">Courriers Archivés</option>
        <option value="courriers-en-cours">Courriers Depart</option>
      </select>

      <label>Date</label>
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      </div>

      <div className="input-group_recherche">
      <label>Objet </label>
      <input
        type="text"
        placeholder="Search by object"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

     <label>Établissement</label>
      <input
        type="text"
        placeholder="Établissement"
        value={etablissment}
        onChange={(e) => setEtablissment(e.target.value)}
      />
      
      
    </div>

    <div className="input-group_recherche">
      <label>Numéro Entite d'origine</label>
      <input
        type="text"
        placeholder="Entry number"
        value={entryNumber}
        onChange={(e) => setEntryNumber(e.target.value)}
      />
      
      <label>Numéro</label>
      <input
        type="text"
        placeholder="Numéro"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />
    </div>
      
   {/*  <div className="input-group_recherche">
      <label>Établissement:</label>
      <input
        type="text"
        placeholder="Établissement"
        value={etablissment}
        onChange={(e) => setEtablissment(e.target.value)}
      />
    </div> */}


    <button onClick={handleSearch} className="boutton-recherche">Search</button>

     </div>


      <div className="courrier-list-container_recherche">
        <ul className="courrier-list_recherche">
        
          {results.map((item) => (
            <li key={item.id} className="courrier-item_Depart_recherche"  onClick={() => handleItemClick(item.id)}>
              <div className="courrier-content">
              <span className="courrier-icon">
              <FontAwesomeIcon icon={faEnvelope} />
  
</span>
                <span className="courrier-subject">{item.objet}</span>
                <span className="courrier-time">{format(new Date(item.sortie), 'yyyy-MM-dd')}</span>

                
              </div>
            </li>
          ))}
        </ul>
        {searchPerformed && results.length === 0 && <p className="no-results-message">Aucun courrier trouvé.</p>}
      </div>
    </div>
    
)}




    {(role === 'chef' ||
                role === 'chefservice' ||
                role === 'responsableservice' ||
                role === 'vicepresident' ||
                role === 'responsablePôle' ||
                role === 'chefdivision' ||
                role === 'secretairegeneral') && (
        
    <div  className="recherche-container">
        <div  className="recherche-form">
        <div className="input-group_recherche">
      <select value={types} onChange={(e) => setTypes(e.target.value)}>
        <option value="courriers-recus">Courriers Recus</option>
        <option value="courriers-transferer">Courriers Transferers</option>
        
      </select>
      <label>Date</label>
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      </div>

      <div className="input-group_recherche">
      <label>Objet</label>
      <input
        type="text"
        placeholder="Search by object"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <label>Établissement</label>
      <input
        type="text"
        placeholder="Établissement"
        value={etablissment}
        onChange={(e) => setEtablissment(e.target.value)}
      />
      
      
    </div>

    <div className="input-group_recherche">
      <label>Numéro Entite d'origine</label>
      <input
        type="text"
        placeholder="Entry number"
        value={entryNumber}
        onChange={(e) => setEntryNumber(e.target.value)}
      />
      
      <label>Numéro</label>
      <input
        type="text"
        placeholder="Numéro"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />
    </div>
      
    {/* <div className="input-group_recherche">
      <label>Établissement:</label>
      <input
        type="text"
        placeholder="Établissement"
        value={etablissment}
        onChange={(e) => setEtablissment(e.target.value)}
      />
    </div> */}

    <button onClick={handleSearchrecus} className="boutton-recherche">Search</button>
</div>
     


      <div className="courrier-list-container_recherche">
        <ul className="courrier-list_recherche">
        
          {result.map((item) => (
            <li key={item.id} className="courrier-item_Depart_recherche"  onClick={() => handleItemrecusClick(item.id)}>
              <div className="courrier-content">
              <span className="courrier-icon">
              <FontAwesomeIcon icon={faEnvelope} />
  
              </span>
                <span className="courrier-subject">{item.objet}</span>
                
                

                
              </div>
            </li>
          ))}
        </ul>
        {searchPerformed && result.length === 0 && <p className="no-results-message">Aucun courrier trouvé.</p>}
      </div>
    </div>
    
)}


</div>



  );
};

export default Recherche;
