import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
 import Dashboard from './Dashboard';
 import All_CourrierDepart from './All_CourrierDepart';
import DetailsCourrierDepart from './DetailsCourrierDepart';
import CourrierDepart from './CourrierDepart';
import Login from './Login';
import CourriersRecus from './CourriersRecus';
import DetailsCourrierRecus from './DetailsCourrierRecus';
import AllCourrierArchiver from './AllCourrierArchiver';
import CourrierArchiver from './CourrierArchiver';
import DetailsCourrierArchiver from './DetailsCourrierArchiver';
import CourrierTransferer from './CourrierTransferer';
import AllCourrierTransferer from './AllCourrierTransferer';
import DetailsCourrierTransferer from './DetailsCourrierTransferer';
import CourriersNonLus from './CourriersNonLus';
import AllUsers from './AllUsers';
import CreateService from './CreateService';
import Users from './Users';
import AllServices from './AllServices';
import ModifierService from './ModifierService';
import MonCompte from './MonCompte';
import Suiver_Courrier from './Suiver_Courrier';
import Modifieruser from './Modifieruser';
import All_Courrier from './All_Courrier';
import Courrier from './Courrier';
import DetailsCourrier from './DetailsCourrier';
import AllDepartement from './AllDepartement';
import ModifierDepartement from './ModifierDepartement';
import CreateDepartement from './CreateDepartement';
import Recherche from './Recherche';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />} />
        <Route path="/" element={isAuthenticated ? <Layout userId={userId} /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="CourrierDepart" element={<CourrierDepart />} />
        <Route path="Recherche" element={<Recherche />} />
        <Route path="All_CourrierDepart" element={<All_CourrierDepart />} />
        <Route path="Courrier" element={<Courrier />} />
        <Route path="/DetailsCourrier/:id" element={<DetailsCourrier />} />
        <Route path="All_Courrier" element={<All_Courrier />} />
        <Route path="/DetailsCourrierDepart/:id" element={<DetailsCourrierDepart />} />
        <Route path="courriers-recus" element={<CourriersRecus />} />
        <Route path="/DetailsCourrierRecus/:id" element={<DetailsCourrierRecus />} />
        <Route path="/DetailsCourrierArchiver/:id" element={<DetailsCourrierArchiver />} />
        <Route path="CourrierArchiver/:id" element={<CourrierArchiver />} />
        <Route path="AllCourrierArchiver" element={<AllCourrierArchiver />} />
        <Route path="/DetailsCourrierTransferer/:id" element={<DetailsCourrierTransferer />} />
        <Route path="AllCourrierTransferer" element={<AllCourrierTransferer />} />
        <Route path="CourrierTransferer/:id" element={<CourrierTransferer />} />
        <Route path="courriers-non-lus" element={<CourriersNonLus />} />
        <Route path="/Users/:id" element={<Users />} />
        <Route path="/Modifieruser/:id" element={<Modifieruser/>} />
        <Route path="AllUsers" element={<AllUsers />} />
        <Route path="/CreateService/:id" element={<CreateService />} />
        <Route path="/CreateDepartement/:id" element={<CreateDepartement />} />
        <Route path="/ModifierService/:serviceId" element={<ModifierService />} />
        <Route path="/ModifierDepartement/:departementId" element={<ModifierDepartement />} />
        <Route path="AllServices" element={<AllServices />} />
        <Route path="AllDepartement" element={<AllDepartement />} />
        <Route path="MonCompte" element={<MonCompte />} />
        <Route path="Suiver_Courrier" element={<Suiver_Courrier />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
