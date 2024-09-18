/* import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import logo from './lg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
  faTachometerAlt,
  faEnvelope,
  faInbox,
  faEnvelopeOpen,
  faArchive,
  faUsers,
  faUserCircle,
  faCog,
  faSignOutAlt,
  faFileExport,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons';

const Layout = () => {
  const location = useLocation();
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [fonction, setFonction] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      console.log(`User ID: ${userIdFromStorage}`);
    }

    const usernameFromStorage = localStorage.getItem('username');
    if (usernameFromStorage) {
      setUsername(usernameFromStorage);
      console.log(`Username: ${usernameFromStorage}`);
    }

    const fonctionFromStorage = localStorage.getItem('fonction');
    if (fonctionFromStorage) {
      setFonction(fonctionFromStorage);
      console.log(`Fonction: ${fonctionFromStorage}`);
    }

    const roleFromStorage = localStorage.getItem('role');
    if (roleFromStorage) {
      setRole(roleFromStorage);
      console.log(`Role: ${roleFromStorage}`);
    }
  }, []);

  return (
    <div className="container">
      <nav>
        <img src={logo} alt="Logo" className="logo" />
        <ul className="main-nav">

        {role === 'SupAdmin' && (
            <>
          <li className={location.pathname === '/AllUsers' ? 'active' : ''}>
              <Link to="/AllUsers">
                <FontAwesomeIcon icon={faUsers} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Utilisateurs
              </Link>
            </li>
           <li className={location.pathname === '/AllDepartement' ? 'active' : ''}>
              <Link to="/AllDepartement">
                <FontAwesomeIcon icon={faCog} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Departements
              </Link>
            </li>

            <li className={location.pathname === '/AllServices' ? 'active' : ''}>
              <Link to="/AllServices">
                <FontAwesomeIcon icon={faCog} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Services
              </Link>
            </li>

            </>
          )}
        {!role.includes('SupAdmin') && (
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Dashboard
            </Link>
          </li>
        )}
          {role === 'Admin' && (
            <>
          <li className={location.pathname === '/All_CourrierDepart' ? 'active' : ''}>
            <Link to="/All_CourrierDepart">
              <FontAwesomeIcon icon={faInbox} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Arrivés
            </Link>
          </li>
          
          <li className={location.pathname === '/All_Courrier' ? 'active' : ''}>
            <Link to="/All_Courrier">
              <FontAwesomeIcon icon={faInbox} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Departs
            </Link>
          </li>
          
          </>

          )}

          {!role.includes('Admin') && (
            <>
             <li className={location.pathname === '/courriers-recus' ? 'active' : ''}>
            <Link to="/courriers-recus">
              <FontAwesomeIcon icon={faEnvelope} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Reçus
            </Link>
          </li>
              <li className={location.pathname === '/courriers-non-lus' ? 'active' : ''}>
                <Link to="/courriers-non-lus">
                  <FontAwesomeIcon icon={faEnvelopeOpen} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Non Lus
                </Link>
              </li>
              {(role === 'chef' || role === 'chefservice') && (
                <>
              <li className={location.pathname === '/AllCourrierTransferer' ? 'active' : ''}>
                <Link to="/AllCourrierTransferer">
                  <FontAwesomeIcon icon={faFileExport} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Transférés
                </Link>
              </li>

             <li className={location.pathname === '/Suiver_Courrier' ? 'active' : ''}>
             <Link to="/Suiver_Courrier">
             <FontAwesomeIcon icon={faEye} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Suivis des Courriers
             </Link>
             </li>
             </>
              )}
            </>
          )}
          {role === 'Admin' && (
          <li className={location.pathname === '/AllCourrierArchiver' ? 'active' : ''}>
            <Link to="/AllCourrierArchiver">
              <FontAwesomeIcon icon={faArchive} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Archivés
            </Link>
          </li>
          )}
         
        </ul>
        <ul className="bottom-nav">
          <li className={location.pathname === '/MonCompte' ? 'active' : ''}>
            <Link to="/MonCompte">
              <FontAwesomeIcon icon={faUserCircle} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Mon Compte
            </Link>
          </li>
         
          <li className={location.pathname === '/se-deconnecter' ? 'active' : ''}>
            <Link to="/Login">
              <FontAwesomeIcon icon={faSignOutAlt} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Se Déconnecter
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <div className="user-info">
          {username && fonction && (
            
            <div className="user-info-container">
               <div className="user-text">
                <p className="username">{username}</p>
              </div>
              <FontAwesomeIcon icon={faUserCircle} style={{ color: '#e6e8ea', fontSize: '35px', marginRight: '10px' }} />
             
            </div>
          )}
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
 */


import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import logo from './lg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faEnvelope,
  faInbox,
  faEnvelopeOpen,
  faArchive,
  faUsers,
  faUserCircle,
  faCog,
  faSignOutAlt,
  faFileExport,
  faPaperPlane,
  faSearch,
  faBuilding,
  faListAlt,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

const Layout = () => {
  const location = useLocation();
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [fonction, setFonction] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      console.log(`User ID: ${userIdFromStorage}`);
    }

    const usernameFromStorage = localStorage.getItem('username');
    if (usernameFromStorage) {
      setUsername(usernameFromStorage);
      console.log(`Username: ${usernameFromStorage}`);
    }

    const fonctionFromStorage = localStorage.getItem('fonction');
    if (fonctionFromStorage) {
      setFonction(fonctionFromStorage);
      console.log(`Fonction: ${fonctionFromStorage}`);
    }

    const roleFromStorage = localStorage.getItem('role');
    if (roleFromStorage) {
      setRole(roleFromStorage);
      console.log(`Role: ${roleFromStorage}`);
    }
  }, []);

  return (
    <div className="container">
      <nav>
        <img src={logo} alt="Logo" className="logo" />
        <ul className="main-nav">

          {role === 'SupAdmin' && (
            <>
              <li className={location.pathname === '/AllUsers' ? 'active' : ''}>
                <Link to="/AllUsers">
                  <FontAwesomeIcon icon={faUsers} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Utilisateurs
                </Link>
              </li>
              <li className={location.pathname === '/AllDepartement' ? 'active' : ''}>
                <Link to="/AllDepartement">
                  <FontAwesomeIcon icon={faBuilding} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Etablissements
                </Link>
              </li>
              <li className={location.pathname === '/AllServices' ? 'active' : ''}>
                <Link to="/AllServices">
                  <FontAwesomeIcon icon={faListAlt} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Services
                </Link>
              </li>
            </>
          )}

          {!role.includes('SupAdmin') && (
            <>
            <li className={location.pathname === '/dashboard' ? 'active' : ''}>
              <Link to="/dashboard">
                <FontAwesomeIcon icon={faTachometerAlt} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Statistiques
              </Link>
            </li>
            <li className={location.pathname === '/Recherche' ? 'active' : ''}>
            <Link to="/Recherche">
              <FontAwesomeIcon icon={faSearch} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Recherche
            </Link>
          </li>
</>
          
          )}

          {role === 'Admin' && (
            <>
              <li className={location.pathname === '/All_CourrierDepart' ? 'active' : ''}>
                <Link to="/All_CourrierDepart">
                  <FontAwesomeIcon icon={faInbox} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Arrivés
                </Link>
              </li>
              <li className={location.pathname === '/All_Courrier' ? 'active' : ''}>
                <Link to="/All_Courrier">
                  <FontAwesomeIcon icon={faPaperPlane} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Départs
                </Link>
              </li>

             
            </>
          )}

          {!role.includes('Admin') && (
            <>
              <li className={location.pathname === '/courriers-recus' ? 'active' : ''}>
                <Link to="/courriers-recus">
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Reçus
                </Link>
              </li>
              <li className={location.pathname === '/courriers-non-lus' ? 'active' : ''}>
                <Link to="/courriers-non-lus">
                  <FontAwesomeIcon icon={faEnvelopeOpen} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Non Lus
                </Link>
              </li>
              {(role === 'chef' || role === 'chefservice'|| role === 'responsablePôle' || role === 'vicepresident'|| role === 'responsableservice' || role === 'secretairegeneral' || role === 'chefdivision') && (
                <>
                  <li className={location.pathname === '/AllCourrierTransferer' ? 'active' : ''}>
                    <Link to="/AllCourrierTransferer">
                      <FontAwesomeIcon icon={faFileExport} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Transférés
                    </Link>
                  </li>
                  <li className={location.pathname === '/Suiver_Courrier' ? 'active' : ''}>
                    <Link to="/Suiver_Courrier">
                      <FontAwesomeIcon icon={faEye} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Suivis des Courriers
                    </Link>
                  </li>
                </>
              )}
            </>
          )}

          {role === 'Admin' && (
            <>
            <li className={location.pathname === '/AllCourrierArchiver' ? 'active' : ''}>
              <Link to="/AllCourrierArchiver">
                <FontAwesomeIcon icon={faArchive} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Courriers Archivés
              </Link>
            </li>

             <li className={location.pathname === '/AllDepartement' ? 'active' : ''}>
                <Link to="/AllDepartement">
                  <FontAwesomeIcon icon={faBuilding} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Etablissements
                </Link>
              </li>
              </>
          )}
        </ul>
        <ul className="bottom-nav">
          <li className={location.pathname === '/MonCompte' ? 'active' : ''}>
            <Link to="/MonCompte">
              <FontAwesomeIcon icon={faUserCircle} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Mon Compte
            </Link>
          </li>
          <li className={location.pathname === '/se-deconnecter' ? 'active' : ''}>
            <Link to="/Login">
              <FontAwesomeIcon icon={faSignOutAlt} style={{ color: '#7b7b7c', fontSize: '20px', marginRight: '10px', opacity: '0.8' }} /> Se Déconnecter
            </Link>
          </li>
        </ul>
      </nav>
      <main>
      <div className="user-info">
      <div className="user-info-container">
        <div className="user-image">
          <img src={require('./ucd_logo_img.png')} alt="Presidency" className="imgucd"/>
        </div>
        {username && fonction && (
          <div className="user-details">
            <div className="user-text">
              <p className="username">{username}</p>
            </div>
            <FontAwesomeIcon icon={faUserCircle} style={{ color: '#e6e8ea', fontSize: '35px' }} className="icon_username" />
          </div>
        )}

      </div>  
</div>



        
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
