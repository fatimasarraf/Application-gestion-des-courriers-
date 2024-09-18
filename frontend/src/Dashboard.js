
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import './Dashboard.css';

// const Dashboard = () => {
//     const [statistics, setStatistics] = useState(null);
//     const [dachbords, setDachbords] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [userId, setUserId] = useState('');
//     const [role, setRole] = useState('');
//     const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
//     const [courriersEnvoyerByWeek, setCourriersEnvoyerByWeek] = useState([]);
//     const [courriersByWeek, setCourriersByWeek] = useState([]);
//     const [courriersArchivesByWeek, setCourriersArchivesByWeek] = useState([]);
//     const [utilisateurList, setUtilisateurList] = useState([]);
//     const [selectedUtilisateur, setSelectedUtilisateur] = useState('');
//     const userIdFromStorage = localStorage.getItem('user_id');
   

//     useEffect(() => {
       

//         axios.get(`http://127.0.0.1:8000/api/Courrier/department_services_and_users_by_user/${userIdFromStorage}/`)
//             .then(response => {
                
//                 setUtilisateurList(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching utilisateurs:', error);
//             });

        
//         if (userIdFromStorage) {
//             setUserId(userIdFromStorage);
//             axios.get(`http://127.0.0.1:8000/api/Courrier/user_statistics/${userIdFromStorage}/`)
//                 .then(response => {
//                     setStatistics(response.data);
//                     setCourriersEnvoyerByWeek(response.data.courriers_envoyer_by_week);
//                     setCourriersByWeek(response.data.courriers_by_week);
//                     setCourriersArchivesByWeek(response.data.courriers_archived_by_week);
                    
//                     setLoading(false);
//                 })
//                 .catch(error => {
//                     console.error('There was an error fetching the statistics!', error);
//                     setLoading(false);
//                 });
//         } else {
//             setLoading(false);
//         }

//         const roleFromStorage = localStorage.getItem('role');
//         if (roleFromStorage) {
//             setRole(roleFromStorage);
//             console.log(`Role: ${roleFromStorage}`);
//         }
//     }, [userIdFromStorage]);

//     useEffect(() => {

//         console.log('Selected utilisateur:', selectedUtilisateur);
//         if (selectedUtilisateur) {
//             axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_transferes_par_utilisateur/${selectedUtilisateur}/`)
//                 .then(response => {
//                     setDachbords(response.data.courriers_transferer_by_user);
//                     /* setCourriersTransferes(response.data.courriers_transferer_by_user);
//                     console.log('Data received:', response.data); */
                  
//                 })
//                 .catch(error => {
//                     console.error('Error fetching courriers transferes:', error);
//                 });
//         }
//     }, [selectedUtilisateur]);

//     const handleUtilisateurChange = (event) => {
//         setSelectedUtilisateur(event.target.value);
//     };

//     const handleMonthChange = (event) => {
//         setSelectedMonth(event.target.value);
//     };

    

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!statistics) {
//         return <div>No statistics available</div>;
//     }

   

//     const filteredEnvoyerByMonth = statistics.courriers_envoyer_by_month.filter(item => item.month === selectedMonth);
//     const filtrercourriers_by_month = statistics.courriers_by_month.filter(item => item.month === selectedMonth);
//     const filteredArchiverByMonth = statistics.archived_courriers_by_month.filter(item => item.month === selectedMonth);
//     const filteredTransfererByMonth = statistics.courriers_transferer_by_month.filter(item => item.month === selectedMonth);
//     const filteredRecusByMonth = statistics.courriers_recus_by_month.filter(item => item.month === selectedMonth);
//     const filteredEnvoyerByWeek = courriersEnvoyerByWeek.filter(item => item.week.startsWith(selectedMonth));
//     const filteredByWeek = courriersByWeek.filter(item => item.week.startsWith(selectedMonth));
//     const filteredArchivesByWeek = courriersArchivesByWeek.filter(item => item.week.startsWith(selectedMonth));
//     const [selectedStatistic, setSelectedStatistic] = useState('courriers_depart');

//     const handleStatisticChange = (type) => setSelectedStatistic(type);
//     return (
//         <div className="dashboard-container">
//             <div className="charts-container">
//             {!role.includes('SupAdmin') && (
//                 <h3 className="dashboard-title">Statistiques</h3>
//             )}


//                 {role === 'Admin' && (
//                     <>
//                     <div className="statistics-container">
//                         <button className="stat-envoyes" onClick={() => handleStatisticChange('courriers_depart')}>
//                             Courriers Arrives: {statistics.courriers_depart_count}
//                         </button>
//                         <button className="stat-departs" onClick={() => handleStatisticChange('courriers_depars')}>
//                             Courriers Departs: {statistics.courriers_count}
//                         </button>
//                         <button className="stat-archiver" onClick={() => handleStatisticChange('courriers_archives')}>
//                             Courriers Archivés: {statistics.archived_courriers_count}
//                         </button>
//                     </div>

//                     {selectedStatistic === 'courriers_depart' && (
//                         <>
//                             <div className="Service-statistics-container">
//                                 <h3 className="chart-title">Courriers Arrivés par etablissment</h3>
//                                 <div className="chart-container">
//                                     <BarChart width={800} height={400} data={statistics.courriers_arrives_par_etablissment}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="etablissment" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Legend />
//                                         <Bar dataKey="count" fill="#fbec44" name="Courriers transférés" />
//                                     </BarChart>
//                                 </div>
//                             </div>

//                             <h3 className="chart-title">Statistiques des Courriers Arrivés par Jour</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={statistics.courriers_envoyer_by_day}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="day" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#b5df41" />
//                                 </BarChart>
//                             </div>

//                             <h3 className="chart-title">Statistiques des Courriers Arrivés par Semaine</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={filteredEnvoyerByWeek}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="week" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#b5df41" />
//                                 </BarChart>
//                             </div>
//                         </>
//                     )}

//                     {selectedStatistic === 'courriers_depars' && (
//                         <>
//                             <h3 className="chart-title">Statistiques des Courriers Departs par Jour</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={statistics.courriers_by_day}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="day" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#7dbff4" />
//                                 </BarChart>
//                             </div>

//                             <h3 className="chart-title">Statistiques des Courriers Departs par Semaine</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={filteredByWeek}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="week" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#7dbff4" />
//                                 </BarChart>
//                             </div>

//                             <div className="charts-container">
//                                 <label htmlFor="month-selector">Select Month: </label>
//                                 <input
//                                     type="month"
//                                     id="month-selector"
//                                     className="month-input"
//                                     value={selectedMonth}
//                                     onChange={handleMonthChange}
//                                 />
//                             </div>

//                             <h3 className="chart-title">Statistiques des Courriers Departs par Mois</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={filtrercourriers_by_month}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="month" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#7dbff4" />
//                                 </BarChart>
//                             </div>
//                         </>
//                     )}

//                     {selectedStatistic === 'courriers_archives' && (
//                         <>
//                             <h3 className="chart-title">Statistiques des Courriers Archivés par Jour</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={statistics.archived_courriers_by_day}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="day" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#f4b24e" />
//                                 </BarChart>
//                             </div>

//                             <h3 className="chart-title">Statistiques des Courriers Archivés par Semaine</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={filteredArchivesByWeek}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="week" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#f4b24e" />
//                                 </BarChart>
//                             </div>

//                             <div className="charts-container">
//                                 <label htmlFor="month-selector">Select Month: </label>
//                                 <input
//                                     type="month"
//                                     id="month-selector"
//                                     className="month-input"
//                                     value={selectedMonth}
//                                     onChange={handleMonthChange}
//                                 />
//                             </div>

//                             <h3 className="chart-title">Statistiques des Courriers Archivés par Mois</h3>
//                             <div className="chart-container">
//                                 <BarChart width={600} height={300} data={filteredArchiverByMonth}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="month" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="count" fill="#f4b24e" />
//                                 </BarChart>
//                             </div>
//                         </>
//                     )}
//                 </>
//                 )}

//                 {(role === 'chef' || role === 'chefservice' || role === 'responsableservice' || role === 'vicepresident' || role === 'responsablePôle' || role === 'chefdivision' || role === 'secretairegeneral' ) && (
//                     <>
//                         <div className="statistics-container">
//                             <p className="stat-transferer">Courriers Transférés: {statistics.transfers_count}</p>
//                             <p className="stat-recus">Courriers Reçus: {statistics.courriers_recus_count}</p>
//                             <p className="stat-non-lus">Courriers non lus: {statistics.courriers_non_lus}</p>
//                             <p className="stat-lus">Courriers lus: {statistics.courriers_lus}</p>
//                         </div>

                        


//                         <h3 className="chart-title">Statistiques des Courriers Transférés par Jour</h3>
//                         <div className="chart-container">
//                         <BarChart width={600} height={300} data={statistics.courriers_transferer_by_day}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="day" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="count" fill="#eddd61" />
//                         </BarChart>
//                         </div>
//                         <div className="charts-container">
//     <label htmlFor="month-selector">Select Month: </label>
//     <input
//         type="month"
//         id="month-selector"
//         className="month-input" // Add this class
//         value={selectedMonth}
//         onChange={handleMonthChange}
//     />
// </div>

//                         <h3 className="chart-title">Statistiques des Courriers Transférés par Mois</h3>
//                         <div className="chart-container">
//                         <BarChart width={600} height={300} data={filteredTransfererByMonth}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="count" fill="#eddd61" />
//                         </BarChart>
//                         </div>


//<h3 className="chart-title">Statistiques des Courriers Reçus par Jour</h3>
//                         <div className="chart-container">
//                         <BarChart width={600} height={300} data={statistics.courriers_recus_by_day}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="day" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="count" fill="#f4b24e" />
//                         </BarChart>
//                         </div>

//<div className="charts-container">
//     <label htmlFor="month-selector">Select Month: </label>
//     <input
//         type="month"
//         id="month-selector"
//         className="month-input" // Add this class
//         value={selectedMonth}
//         onChange={handleMonthChange}
//     />
// </div>

//<h3 className="chart-title">Courriers Reçus by Month</h3>
//                         <div className="chart-container">
//                         <BarChart width={600} height={300} data={filteredRecusByMonth}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="count" fill="#f4b24e" />
//                         </BarChart>
//                         </div>

//<div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Arrivés par etablissment</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_arrives_par_etablissment}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="etablissment" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#fbec44" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>


//                         <div className="charts-container">
//                             <label htmlFor="utilisateur-selector">Select Utilisateur: </label>
//                             <select
//                                 id="utilisateur-selector"
//                                 value={selectedUtilisateur}
//                                 onChange={handleUtilisateurChange}
//                             >
//                                 <option value="">Select User</option>
//                                 {utilisateurList.map(user => (
//                                     <option key={user.id} value={user.user_id}>{user.username}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         {selectedUtilisateur && (
//                             <>
//                                 <h3 className="chart-title">Statistiques des Courriers Transférés par Utilisateur</h3>
                                
//                                 <div className="chart-container">
                               
//                                     <BarChart width={600} height={300} data={dachbords}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="day" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Legend />
//                                         <Bar dataKey="count" fill="#eddd61" />
//                                     </BarChart>
//                                 </div>
//                             </>
//                         )}

//<div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Transférés par division</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_transferer_par_division}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="user_service__division" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#61d237" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>
//<div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Transférés par pole</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_transferer_par_pole}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="user_service__pole" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#8884d8" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>

//<div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Transférés par Service</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_transferer_par_service}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="user_service__service__name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#8884d8" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>
               
//                     </>
//                 )}
                

//                 {role === 'chefdivision' && (
//                     <>
//                         <div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Transférés par Service</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_transferer_par_service}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="user_service__service__name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#8884d8" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>
//                     </>
//                 )}

// {(role === 'vicepresident'|| role === 'chef'|| role === 'responsablePôle'|| role === 'secretairegeneral' )&& (
//                     <>
//                         <div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Transférés par division</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_transferer_par_division}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="user_service__division" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#61d237" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>

                        
//                     </>
//                 )}


// {role === 'chef' && (
//                     <>
//                         <div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Transférés par pole</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_transferer_par_pole}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="user_service__pole" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#8884d8" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>
//                     </>
//                 )}

//                 {role === 'Utilisateur' || role === 'chefcentre' && (
//                     <>
//                         <div className="statistics-container">
//                             <p className="stat-recus">Courriers Reçus: {statistics.courriers_recus_count}</p>
//                             <p className="stat-non-lus">Courriers non lus: {statistics.courriers_non_lus}</p>
//                             <p className="stat-lus">Courriers lus: {statistics.courriers_lus}</p>
//                         </div>
//                     </>
//                 )}

//                 {(role === 'chef' || role === 'chefservice' || role === 'Utilisateur' || role === 'responsableservice' || role === 'vicepresident' || role === 'responsablePôle' || role === 'chefdivision' || role === 'secretairegeneral' || role === 'chefcentre') && (
//                     <>
//                         <div className="Service-statistics-container">
//                         <h3 className="chart-title">Courriers Arrivés par etablissment</h3>
//                             <div className="chart-container">
//                             <BarChart width={800} height={400} data={statistics.courriers_arrives_par_etablissment}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="etablissment" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#fbec44" name="Courriers transférés" />
//                             </BarChart>
//                         </div>
//                         </div>
                        
//                         <h3 className="chart-title">Statistiques des Courriers Reçus par Jour</h3>
//                         <div className="chart-container">
//                         <BarChart width={600} height={300} data={statistics.courriers_recus_by_day}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="day" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="count" fill="#f4b24e" />
//                         </BarChart>
//                         </div>
//                         <div className="charts-container">
//     <label htmlFor="month-selector">Select Month: </label>
//     <input
//         type="month"
//         id="month-selector"
//         className="month-input" // Add this class
//         value={selectedMonth}
//         onChange={handleMonthChange}
//     />
// </div>

//                         <h3 className="chart-title">Courriers Reçus by Month</h3>
//                         <div className="chart-container">
//                         <BarChart width={600} height={300} data={filteredRecusByMonth}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="count" fill="#f4b24e" />
//                         </BarChart>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const [statistics, setStatistics] = useState(null);
    const [dachbords, setDachbords] = useState(null);
    const [dachs, setDachs] = useState(null);

    const [divs, setDivs] = useState(null);
    const [statics, setStatics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
    const [selectedDay, setSelectedDay] = useState(new Date().toISOString().substring(0, 10));
    const [selectedWeek, setSelectedWeek] = useState('');
    const [courriersEnvoyerByWeek, setCourriersEnvoyerByWeek] = useState([]);
    const [courriersByWeek, setCourriersByWeek] = useState([]);
    const [courriersArchivesByWeek, setCourriersArchivesByWeek] = useState([]);
    const [courrierstransfererByWeek, setCourrierstransfererByWeek] = useState([]);
    const [courriersrecusByWeek, setCourriersecusByWeek] = useState([]);
    const [utilisateurList, setUtilisateurList] = useState([]);
    const [selectedUtilisateur, setSelectedUtilisateur] = useState('');
    const [etablissementList, setEtablissementList] = useState('');
    const [selectedetablissement, setEtablissement] = useState('');

    

    

    const [etablissementArrivesList, setEtablissementArrivesList] = useState('');
    const [selectedetablissements, setEtablissements] = useState('');

    const userIdFromStorage = localStorage.getItem('user_id');
    const [selectedStatistic, setSelectedStatistic] = useState('courriers_depart');
    const [selectedStatistics, setSelectedStatistics] = useState('recus');
    const [selecteddachbord, setSelecteddachbord] = useState('recus');


    useEffect(() => {
        if (userIdFromStorage) {
            setUserId(userIdFromStorage);
            axios.get(`http://127.0.0.1:8000/api/Courrier/department_services_and_users_by_user/${userIdFromStorage}/`)
                .then(response => setUtilisateurList(response.data))
                .catch(error => console.error('Error fetching utilisateurs:', error));


                

            axios.get(`http://127.0.0.1:8000/api/Courrier/etablissement/`)
            .then(response => {
                setEtablissementList(response.data);
                setEtablissementArrivesList(response.data);
            })
            .catch(error => console.error('Error fetching etablissement:', error));


            

            

                    



            axios.get(`http://127.0.0.1:8000/api/Courrier/user_statistics/${userIdFromStorage}/`)
                .then(response => {
                    setStatistics(response.data);
                    setCourriersEnvoyerByWeek(response.data.courriers_envoyer_by_week);
                    setCourriersByWeek(response.data.courriers_by_week);
                    setCourriersArchivesByWeek(response.data.courriers_archived_by_week);
                    setCourrierstransfererByWeek(response.data.courriers_transferer_by_week);
                    setCourriersecusByWeek(response.data.courriers_recus_by_week);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the statistics!', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

        const roleFromStorage = localStorage.getItem('role');
        if (roleFromStorage) {
            setRole(roleFromStorage);
            console.log(`Role: ${roleFromStorage}`);
        }
    }, [userIdFromStorage]);

    useEffect(() => {
        if (selectedUtilisateur) {
            axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_transferes_par_utilisateur/${selectedUtilisateur}/`)
                .then(response => setDachbords(response.data.courriers_transferer_by_user))
                .catch(error => console.error('Error fetching courriers transferes:', error));
        }
    }, [selectedUtilisateur]);

    useEffect(() => {
        if (selectedetablissement) {
            axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_recus_par_etablissement/${userId}/${selectedetablissement}/`)
                .then(response => setStatics(response.data.courriers_recus_par_etablissment))
                .catch(error => console.error('Error fetching courriers recus:', error));
        }
    }, [selectedetablissement]);

    useEffect(() => {
        if (selectedetablissements) {
            axios.get(`http://127.0.0.1:8000/api/Courrier/courriers_arrives_par_etablissement/${userId}/${selectedetablissements}/`)
                .then(response => setDachs(response.data.courriers_arrives_par_etablissment))
                .catch(error => console.error('Error fetching courriers arrives:', error));
        }
    }, [selectedetablissements]);

    

   

    

    const handleUtilisateurChange = (event) => setSelectedUtilisateur(event.target.value);
    const handleEtablissementChange = (event) => setEtablissement(event.target.value);
    const handleEtablissementArrivesChange = (event) => setEtablissements(event.target.value);
    
    const handleMonthChange = (event) => setSelectedMonth(event.target.value);
    const handleDayChange = (event) => setSelectedDay(event.target.value);
    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

   


    if (loading) return <div>Loading...</div>;

    if (!statistics) return <div>No statistics available</div>;

    const filteredEnvoyerByMonth = statistics.courriers_envoyer_by_month.filter(item => item.month === selectedMonth);
    const filteredCourriersByMonth = statistics.courriers_by_month.filter(item => item.month === selectedMonth);
    const filteredArchiverByMonth = statistics.archived_courriers_by_month.filter(item => item.month === selectedMonth);
    const filteredTransfererByMonth = statistics.courriers_transferer_by_month.filter(item => item.month === selectedMonth);
    const filteredRecusByMonth = statistics.courriers_recus_by_month.filter(item => item.month === selectedMonth);
    
    const filteredData = courriersEnvoyerByWeek.find(item => item.week === selectedWeek);
    const filteredcourrierData = courriersByWeek.find(item => item.week === selectedWeek);
    const filteredArchivesByWeek = courriersArchivesByWeek.find(item => item.week === selectedWeek);
    const filteredTransfererByWeek = courrierstransfererByWeek.find(item => item.week === selectedWeek);
    const filteredrecusByWeek = courriersrecusByWeek.find(item => item.week === selectedWeek);
    const filteredRecusByDay = statistics.courriers_recus_by_day.filter(item => item.day === selectedDay);
    const filteredTransferByDay = statistics.courriers_transferer_by_day.filter(item => item.day === selectedDay);
    const filteredArrivesByDay = statistics.courriers_envoyer_by_day.filter(item => item.day === selectedDay);
    
    const filteredDepartsByDay = statistics.courriers_by_day.filter(item => item.day === selectedDay);
    const filteredArchivesByDay = statistics.archived_courriers_by_day.filter(item => item.day === selectedDay);

    const handleStatisticChange = (type) => setSelectedStatistic(type);

    const handleStatisticClick = (statType) => {
        setSelectedStatistics(statType);
    };

    const handleDachbordClick = (statType) => {
        setSelecteddachbord(statType);
    };

    return (
        <div className="dashboard-container">
            <div className="charts-container">
                {!role.includes('SupAdmin') && <h3 className="dashboard-title">Statistiques</h3>}

                {role === 'Admin' && (
                    <>
                        <div className="statistics-container">
                            <p className="stat-envoyes" onClick={() => handleStatisticChange('courriers_depart')}>
                                Courriers Arrivés: {statistics.courriers_depart_count}
                            </p>
                            <p className="stat-departs" onClick={() => handleStatisticChange('courriers_depars')}>
                                Courriers Départs: {statistics.courriers_count}
                            </p>
                            <p className="stat-archiver" onClick={() => handleStatisticChange('courriers_archives')}>
                                Courriers Archivés: {statistics.archived_courriers_count}
                            </p>
                        </div>

                        {selectedStatistic === 'courriers_depart' && (
                            <>
                                <div className="Service-statistics-container">
                                    
                                <h3 className="chart-title">Statistiques des Courriers Arrivés par Etablissement</h3>
<div className="charts-container">
                        <label htmlFor="etablisement-selector"> choisir un établissement:</label>
                        <select
                            id="etablisement_arrives-selector"
                            value={selectedetablissements}
                            className="month-input"
                            onChange={handleEtablissementArrivesChange}
                        >
                            <option value="">Sélectionner un établissement</option>
                            {etablissementArrivesList.map(dept => (
                                <option key={dept.id} value={dept.nom}>{dept.nom}</option>
                            ))}
                        </select>
                    </div>

                    {selectedetablissements && (
                        <>
                            
                            <div className="chart-container">
                                <BarChart width={600} height={300} data={dachs}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#b5df41" />
                                </BarChart>
                            </div>
                        </>
                    )}



                                </div>

                               

<h3 className="chart-title">Statistiques des Courriers Arrivés par Jour</h3>
                                <div className="chart-container_day">
                                    <label htmlFor="day-select" className="label-day" >Choisir un jour:</label>
                                    <input type="date" id="day-select" value={selectedDay} onChange={handleDayChange} className="chart-day"  />

                                    <BarChart width={600} height={300} data={filteredArrivesByDay} className="chart-day_courbe">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#b5df41" />
                                    </BarChart>
                                </div>

                                

<div className="charts-container">
<h3 className="chart-title">Statistiques des Courriers Arrivés par Semaine</h3>

<div className="week-selector-container">
                    <label htmlFor="week-selector">choisir une semaine </label>
                    <select
                        id="week-selector"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className="month-input"
                    >
                        <option value="">sélectionner une semaine</option>
                        {courriersEnvoyerByWeek.map(item => (
                            <option key={item.week} value={item.week}>
                                {item.week}
                            </option>
                        ))}
                    </select>
                </div>


                {selectedWeek && filteredData && (
                    <>
                        <h3 className="chart-title">Courriers Arrivés pour la Semaine {selectedWeek}</h3>
                        <div className="chart-container">
                            <BarChart width={600} height={300} data={[filteredData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#b5df41" />
                            </BarChart>
                        </div>
                    </>
                )}
                {selectedWeek && !filteredData && (
                    <div>aucun courrier trouvé</div>
                )}

                </div>






                                <h3 className="chart-title">Statistiques des Courriers Arrivés par Mois</h3>
                                <div className="charts-container">
                                    <label htmlFor="month-selector">choisir un mois </label>
                                    <input
                                        type="month"
                                        id="month-selector"
                                        className="month-input"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                    />
                                </div>

                                
                                <div className="chart-container">
                                    <BarChart width={600} height={300} data={filteredEnvoyerByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#b5df41" />
                                    </BarChart>
                                </div>
                            </>
                        )}

                        {selectedStatistic === 'courriers_depars' && (
                            <>
                               

                                <h3 className="chart-title">Statistiques des Courriers Départs par Jour</h3>
                                <div className="chart-container_day">
                                    <label htmlFor="day-select" className="label-day" >Choisir un jour:</label>
                                    <input type="date" id="day-select" value={selectedDay} onChange={handleDayChange} className="chart-day"  />

                                    <BarChart width={600} height={300} data={filteredDepartsByDay} className="chart-day_courbe">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#7dbff4" />
                                    </BarChart>
                                </div>

                               


<div className="charts-container">
<h3 className="chart-title">Statistiques des Courriers Départs par Semaine</h3>

<div className="week-selector-container">
                    <label htmlFor="week-selector">choisir une semaine </label>
                    <select
                        id="week-selector"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className="month-input"
                    >
                        <option value="">Sélectionner une semaine</option>
                        {courriersByWeek.map(item => (
                            <option key={item.week} value={item.week}>
                                {item.week}
                            </option>
                        ))}
                    </select>
                </div>


                {selectedWeek && filteredcourrierData && (
                    <>
                        <h3 className="chart-title">Courriers Départs pour la Semaine {selectedWeek}</h3>
                        <div className="chart-container">
                            <BarChart width={600} height={300} data={[filteredcourrierData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#7dbff4" />
                            </BarChart>
                        </div>
                    </>
                )}
                {selectedWeek && !filteredcourrierData && (
                    <div>aucun courrier trouvé</div>
                )}

                </div>       
                <h3 className="chart-title">Statistiques des Courriers Départs par Mois</h3>
                                <div className="charts-container">
                                    <label htmlFor="month-selector">choisir un mois: </label>
                                    <input
                                        type="month"
                                        id="month-selector"
                                        className="month-input"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                    />
                                </div>

                                
                                <div className="chart-container">
                                    <BarChart width={600} height={300} data={filteredCourriersByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#7dbff4" />
                                    </BarChart>
                                </div>
                            </>
                        )}

                        {selectedStatistic === 'courriers_archives' && (
                            <>
                                

                                <h3 className="chart-title">Statistiques des Courriers Archivés par Jour</h3>
                                <div className="chart-container_day">
                                    <label htmlFor="day-select" className="label-day" >Choisir un jour:</label>
                                    <input type="date" id="day-select" value={selectedDay} onChange={handleDayChange} className="chart-day"  />

                                    <BarChart width={600} height={300} data={filteredArchivesByDay} className="chart-day_courbe">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#f4b24e" />
                                    </BarChart>
                                </div>

                              


<div className="charts-container">
<h3 className="chart-title">Statistiques des Courriers Archivés par Semaine</h3>

<div className="week-selector-container">
                    <label htmlFor="week-selector">choisir une semaine </label>
                    <select
                        id="week-selector"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className="month-input"
                    >
                        <option value="">Sélectionner une semaine</option>
                        {courriersArchivesByWeek.map(item => (
                            <option key={item.week} value={item.week}>
                                {item.week}
                            </option>
                        ))}
                    </select>
                </div>


                {selectedWeek && filteredArchivesByWeek && (
                    <>
                        <h3 className="chart-title">Courriers Archivés pour la Semaine {selectedWeek}</h3>
                        <div className="chart-container">
                            <BarChart width={600} height={300} data={[filteredArchivesByWeek]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#f4b24e" />
                            </BarChart>
                        </div>
                    </>
                )}
                {selectedWeek && !filteredArchivesByWeek && (
                    <div>aucun courrier trouvé</div>
                )}

                </div>                     
                <h3 className="chart-title">Statistiques des Courriers Archivés par Mois</h3>
                                <div className="charts-container">
                                    <label htmlFor="month-selector">choisir un mois: </label>
                                    <input
                                        type="month"
                                        id="month-selector"
                                        className="month-input"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                    />
                                </div>

                                
                                <div className="chart-container">
                                    <BarChart width={600} height={300} data={filteredArchiverByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#f4b24e" />
                                    </BarChart>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            

            <div className="charts-container">
            {(
                role === 'chef' ||
                role === 'chefservice' ||
                role === 'responsableservice' ||
                role === 'vicepresident' ||
                role === 'responsablePôle' ||
                role === 'chefdivision' ||
                role === 'secretairegeneral'
            ) && (
                <>
                    <div className="statistics-container">
                        <p
                            className="stat-transferer"
                            onClick={() => handleStatisticClick('transfers')}
                        >
                            Courriers Transférés: {statistics.transfers_count}
                        </p>
                        <p
                            className="stat-recus"
                            onClick={() => handleStatisticClick('recus')}
                        >
                            Courriers Reçus: {statistics.courriers_recus_count}
                        </p>
                        <p
                            className="stat-non-lus"
                            
                        >
                            Courriers non lus: {statistics.courriers_non_lus}
                        </p>
                        <p
                            className="stat-lus"
                            
                        >
                            Courriers lus: {statistics.courriers_lus}
                        </p>
                    </div>

                    {selectedStatistics === 'transfers' && (
                        <>
                            

<h3 className="chart-title">Statistiques des Courriers Transférés par Jour</h3>
                                <div className="chart-container_day">
                                    <label htmlFor="day-select" className="label-day" >Choisir un jour:</label>
                                    <input type="date" id="day-select" value={selectedDay} onChange={handleDayChange} className="chart-day"  />

                                    <BarChart width={600} height={300} data={filteredTransferByDay} className="chart-day_courbe">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#eddd61" />
                                    </BarChart>
                                </div>
                                <h3 className="chart-title">Statistiques des Courriers Transférés par Mois</h3>
                            <div className="charts-container">
                                <label htmlFor="month-selector">choisir un mois: </label>
                                <input
                                    type="month"
                                    id="month-selector"
                                    className="month-input"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                />
                            </div>

                            
                            <div className="chart-container">
                                <BarChart width={600} height={300} data={filteredTransfererByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#eddd61" />
                                </BarChart>
                            </div>

                            

                            <div className="charts-container">
<h3 className="chart-title">Statistiques des Courriers Transférés par Semaine</h3>

<div className="week-selector-container">
                    <label htmlFor="week-selector">choisir une semaine: </label>
                    <select
                        id="week-selector"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className="month-input"
                    >
                        <option value="">Sélectionner une semaine</option>
                        {courrierstransfererByWeek.map(item => (
                            <option key={item.week} value={item.week}>
                                {item.week}
                            </option>
                        ))}
                    </select>
                </div>


                {selectedWeek && filteredTransfererByWeek && (
                    <>
                        <h3 className="chart-title">Courriers Transférés pour la Semaine {selectedWeek}</h3>
                        <div className="chart-container">
                            <BarChart width={600} height={300} data={[filteredTransfererByWeek]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#eddd61" />
                            </BarChart>
                        </div>
                    </>
                )}
                {selectedWeek && !filteredTransfererByWeek && (
                    <div>aucun courrier transférer</div>
                )}

                </div>  

                <h3 className="chart-title">Statistiques des Courriers Transférés par Utilisateur</h3>
                            <div className="charts-container">
                        <label htmlFor="utilisateur-selector">choisir un utilisateur: </label>
                        <select
                            id="utilisateur-selector"
                            value={selectedUtilisateur}
                            onChange={handleUtilisateurChange}
                            className="month-input"
                        >
                            <option value="">Sélectionner un utilisateur</option>
                            {utilisateurList.map(user => (
                                <option key={user.id} value={user.user_id}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    {selectedUtilisateur && (
                        <>
                            
                            <div className="chart-container">
                                <BarChart width={600} height={300} data={dachbords}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#eddd61" />
                                </BarChart>
                            </div>
                        </>
                    )}





{(role === 'chefdivision'||role === 'vicepresident'|| role === 'responsablePôle' || role === 'secretairegeneral'||role === 'chef') && (
                    <div className="Service-statistics-container">
                                            <h3 className="chart-title">Courriers Transférés par Service</h3>
                                            <div className="chart-container">
                                                 <BarChart width={800} height={400} data={statistics.courriers_transferer_par_service}>
                                                     <CartesianGrid strokeDasharray="3 3" />
                                                     <XAxis dataKey="user_service__service__name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="count" fill="#eddd61" name="Courriers transférés" />
                                                </BarChart>
                                            </div>
                                            </div>
)}


                        </>
                    )}

                    {selectedStatistics === 'recus' && (
                        <>

                            

<h3 className="chart-title">Statistiques des Courriers Recus par Jour</h3>
                                <div className="chart-container_day">
                                    <label htmlFor="day-select" className="label-day" >Choisir un jour:</label>
                                    <input type="date" id="day-select" value={selectedDay} onChange={handleDayChange} className="chart-day"  />

                                    <BarChart width={600} height={300} data={filteredRecusByDay} className="chart-day_courbe">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#f4b24e" />
                                    </BarChart>
                                </div>

                                <div className="charts-container">
<h3 className="chart-title">Statistiques des Courriers Recus par Semaine</h3>

<div className="week-selector-container">
                    <label htmlFor="week-selector">choisir une semaine: </label>
                    <select
                        id="week-selector"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className="month-input"
                    >
                        <option value="">Sélectionner une semaine</option>
                        {courriersrecusByWeek.map(item => (
                            <option key={item.week} value={item.week}>
                                {item.week}
                            </option>
                        ))}
                    </select>
                </div>


                {selectedWeek && filteredrecusByWeek && (
                    <>
                        <h3 className="chart-title">Courriers Recus pour la Semaine {selectedWeek}</h3>
                        <div className="chart-container">
                            <BarChart width={600} height={300} data={[filteredrecusByWeek]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#f4b24e" />
                            </BarChart>
                        </div>
                    </>
                )}
                {selectedWeek && !filteredrecusByWeek && (
                    <div>aucun courrier trouvé</div>
                )}

                </div>                                 





                                                        
                <h3 className="chart-title">Statistiques des Courriers Reçus par Mois</h3>
                            <div className="charts-container">
                                <label htmlFor="month-selector">choisir un mois: </label>
                                <input
                                    type="month"
                                    id="month-selector"
                                    className="month-input"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                />
                            </div>

                            
                            <div className="chart-container">
                                <BarChart width={600} height={300} data={filteredRecusByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#f4b24e" />
                                </BarChart>
                            </div>



                           
                            <h3 className="chart-title">Statistiques des Courriers Recus par Etablissemengt</h3>
<div className="charts-container">
                        <label htmlFor="etablisement-selector">choisir un établissement: </label>
                        <select
                            id="etablisement-selector"
                            value={selectedetablissement}
                            className="month-input"
                            onChange={handleEtablissementChange}
                        >
                            <option value="">Sélectionner un établissement</option>
                            {etablissementList.map(etab => (
                                <option key={etab.id} value={etab.nom}>{etab.nom}</option>
                            ))}
                        </select>
                    </div>

                    {selectedetablissement && (
                        <>
                            
                            <div className="chart-container">
                                <BarChart width={600} height={300} data={statics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#f4b24e" />
                                </BarChart>
                            </div>
                        </>
                    )}
                        </>

                    )}

                   

                    

                   






                </>
            )}

            
        </div>

        <div className="charts-container">

        {(role === 'Utilisateur' || role === 'chefcentre' )&& (
                    <>
                        <div className="statistics-container">
                        <p
                            className="stat-recus"
                            onClick={() => handleDachbordClick('recus')}
                        >
                            Courriers Reçus: {statistics.courriers_recus_count}
                        </p>
                            <p className="stat-non-lus">Courriers non lus: {statistics.courriers_non_lus}</p>
                            <p className="stat-lus">Courriers lus: {statistics.courriers_lus}</p>
                         </div>

                         {selecteddachbord === 'recus' && (              
<>

<h3 className="chart-title">Statistiques des Courriers Recus par Jour</h3>
                                <div className="chart-container_day">
                                    <label htmlFor="day-select" className="label-day" >Choisir un jour:</label>
                                    <input type="date" id="day-select" value={selectedDay} onChange={handleDayChange} className="chart-day"  />

                                    <BarChart width={600} height={300} data={filteredRecusByDay} className="chart-day_courbe">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#f4b24e" />
                                    </BarChart>
                                </div>
                            

                            <h3 className="chart-title">Statistiques des Courriers Reçus par Mois</h3>
                            <div className="charts-container">
                                <label htmlFor="month-selector">choisir un mois: </label>
                                <input
                                    type="month"
                                    id="month-selector"
                                    className="month-input"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                />
                            </div>  

                            
                            <div className="chart-container">
                                <BarChart width={600} height={300} data={filteredRecusByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#f4b24e" />
                                </BarChart>
                            </div>  


  <div className="charts-container">
<h3 className="chart-title">Statistiques des Courriers Recus par Semaine</h3>

<div className="week-selector-container">
                    <label htmlFor="week-selector">choisir une semaine: </label>
                    <select
                        id="week-selector"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className="month-input"
                    >
                        <option value="">Sélectionner une semaine</option>
                        {courriersrecusByWeek.map(item => (
                            <option key={item.week} value={item.week}>
                                {item.week}
                            </option>
                        ))}
                    </select>
                </div>


                {selectedWeek && filteredrecusByWeek && (
                    <>
                        <h3 className="chart-title">Courriers Recus pour la Semaine {selectedWeek}</h3>
                        <div className="chart-container">
                            <BarChart width={600} height={300} data={[filteredrecusByWeek]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#f4b24e" />
                            </BarChart>
                        </div>
                    </>
                )}
                {selectedWeek && !filteredrecusByWeek && (
                    <div>aucun courrier trouvé</div>
                )}

                </div>                              

                                    
                            <div className="Service-statistics-container">
                        



<div className="charts-container">
                        <label htmlFor="etablisement-selector">choisir un établissement: </label>
                        <select
                            id="etablisement-selector"
                            value={selectedetablissement}
                            className="month-input"
                            onChange={handleEtablissementChange}
                        >
                            <option value="">Sélectionner un établissement</option>
                            {etablissementList.map(etab => (
                                <option key={etab.id} value={etab.nom}>{etab.nom}</option>
                            ))}
                        </select>
                    </div>

                    {selectedetablissement && (
                        <>
                            <h3 className="chart-title">Statistiques des Courriers Recus par Etablissemengt</h3>
                            <div className="chart-container">
                                <BarChart width={600} height={300} data={statics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#f4b24e" />
                                </BarChart>
                            </div>
                        </>
                    )}
                    </div>
</>
                         )}

                    </>
                )} 


        </div>
        </div>
    );
};

export default Dashboard;



