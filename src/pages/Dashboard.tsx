import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { generateUserReport } from '../utils/userReport';
import { generateAdminReport } from '../utils/adminReport';
import { exportManagementReportPDF } from '../utils/reportExportAdmin';
import { exportToPDF, exportToCSV } from '../utils/reportExport';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar, Pie} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);


const Dashboard: React.FC = () => {
  const { userData, loading } = useAuth();
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    if (userData?.uid && userData?.role === 'basic') {
      generateUserReport(userData.uid).then((data) => setReportData(data));
    } else if (userData?.role === 'admin') {
      generateAdminReport().then((data) => setReportData(data));
      console.log('Render de Admin');
    }
  }, [userData]);

  if (loading || !reportData) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  const { summary, userProjects, collaborationStats } = reportData;


  const renderAdminDashboard = () => {
    const roleDistributionData = {
      labels: Object.keys(reportData.users.roleDistribution),
      datasets: [
        {
          label: 'Cantidad de Usuarios',
          data: Object.values(reportData.users.roleDistribution),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  
    const countryDistributionData = {
      labels: Object.keys(reportData.users.byCountry),
      datasets: [
        {
          label: 'Usuarios por País',
          data: Object.values(reportData.users.byCountry),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
        },
      ],
    };
    return(
    <div className="container mt-4">
      <div className="text-end mt-1 me-1">
      <button 
        className="btn btn-success mt-1 me-2" 
        onClick={() => {
          exportManagementReportPDF()
            .then(() => alert('Informe exportado exitosamente en PDF.'))
            .catch((error) => alert('Error al exportar el informe: ' + error.message));
        }}
      >
        Exportar Informe de Gestión (PDF)
      </button>
    </div>
      <h1 className="mb-4 text-center">Informe de Gestión - Administrador</h1>
      <h4 className="mt-4">Usuarios por Empresa</h4>
      <ul className="list-group">
        {Object.entries(reportData.users.byCompany).map(([company, count]) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={company}>
            {company}
            <span className="badge bg-info rounded-pill">{String(count)}</span>
          </li>
        ))}
      </ul>
      {/* Sección de Usuarios */}
      <h2 className="mt-4">Usuarios</h2>
      <p><strong>Total de usuarios:</strong> {reportData.users.totalUsers}</p>
  
      <div className="row">
        <div className="col-md-6">
          <h4>Distribución de Roles</h4>
          <ul className="list-group">
            {Object.entries(reportData.users.roleDistribution).map(([role, count]) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={role}>
                {role}
                <span className="badge bg-primary rounded-pill">{String(count)}</span>
              </li>
            ))}
          </ul>
              {/* Gráfico de Barras: Distribución de Roles */}
              <h4 className="mt-4">Distribución de Roles</h4>
              <Bar data={roleDistributionData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
        <div className="col-md-6">
          <h4>Usuarios por País</h4>
          <ul className="list-group">
            {Object.entries(reportData.users.byCountry).map(([country, count]) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={country}>
                {country}
                <span className="badge bg-success rounded-pill">{String(count)}</span>
              </li>
            ))}
          </ul>
          {/* Gráfico de Torta: Usuarios por País */}
          <h4 className="mt-4">Usuarios por País</h4>
          <Pie data={countryDistributionData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
  
      <h4 className="mt-4">Usuarios por Empresa</h4>
      <ul className="list-group">
        {Object.entries(reportData.users.byCompany).map(([company, count]) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={company}>
            {company}
            <span className="badge bg-info rounded-pill">{String(count)}</span>
          </li>
        ))}
      </ul>
  
      <h4 className="mt-4">Usuarios Ultima Sesión</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Último Inicio de Sesión</th>
          </tr>
        </thead>
        <tbody>
          {reportData.users.inactiveUsers.map((user: any) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Sección de Proyectos */}
      <h2 className="mt-4">Proyectos</h2>
      <p><strong>Total de proyectos:</strong> {reportData.projects.totalProjects}</p>
  
      <h4>Distribución por Estado</h4>
      <ul className="list-group">
        {Object.entries(reportData.projects.projectStatusDistribution).map(([status, count]) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={status}>
            {status}
            <span className="badge bg-warning rounded-pill">{String(count)}</span>
          </li>
        ))}
      </ul>
  
      <p className="mt-3"><strong>Proyectos sin colaboradores:</strong> {reportData.projects.projectsWithoutCollaborators}</p>
      <p><strong>Promedio de colaboradores por proyecto:</strong> {reportData.projects.avgCollaboratorsPerProject.toFixed(2)}</p>
      <p><strong>Tasa de finalización de proyectos:</strong> {reportData.projects.completionRate.toFixed(2)}%</p>
      <p><strong>Proyectos vencidos:</strong> {reportData.projects.overdueProjects}</p>
      <p><strong>Proyectos creados en el último mes:</strong> {reportData.projects.projectsLastMonth}</p>
  
      <h4 className="mt-4">Duración Promedio de Proyectos Finalizados</h4>
      <p>{reportData.projects.avgProjectDuration.toFixed(2)} días</p>
  
      <h4>Proyectos Más Colaborativos</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Colaboradores</th>
          </tr>
        </thead>
        <tbody>
          {reportData.projects.mostCollaborativeProjects.map((project: any) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.numCollaborators}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <h4>Proyectos Más Activos (Últimos 30 días)</h4>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Actividades Recientes</th>
          </tr>
        </thead>
        <tbody>
          {reportData.projects.mostActiveProjects.map((project: any) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.recentActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <h4>Proyectos Más Retrasados</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Días de Retraso</th>
          </tr>
        </thead>
        <tbody>
          {reportData.projects.mostDelayedProjects.map((project: any) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.delayDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <h4>Crecimiento de Usuarios por Mes</h4>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Usuarios Nuevos</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(reportData.projects.usersGrowth).map(([month, count]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{String(count)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
 };

  const renderUserDashboard = () => (
    <div className="container mt-4">
      <div className="text-end mt-1 me-1">
        <button className="btn btn-primary mt-1 me-2" onClick={() => exportToPDF(reportData)}>
          Exportar a PDF
        </button>
        <button className="btn btn-secondary" onClick={() => exportToCSV(reportData)}>
          Exportar a CSV
        </button>
      </div>
      <h1 className="mb-4">Informe de Usuario Básico</h1>
      <p><strong>Nombre:</strong> {userData?.name} {userData?.lastName}</p>
      <p><strong>Empresa:</strong> {userData?.company}</p>
      <p><strong>Proyectos Totales:</strong> {summary.totalCreated}</p>
      <p><strong>Proyectos Activos:</strong> {summary.activeProjects}</p>
      <p><strong>Proyectos Pendientes:</strong> {summary.pendingProjects}</p>
      <p><strong>Proyectos Finalizados:</strong> {summary.finishedProjects}</p>
      <p><strong>Tiempo Total en Proyectos:</strong> {summary.totalProjectTime.toFixed(2)} días</p>
      <p><strong>Tiempo Promedio por Proyecto:</strong> {(summary.totalProjectTime / summary.totalCreated).toFixed(2)} días</p>

      <h2 className="mt-4">Proyectos Creados</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Días Restantes</th>
          </tr>
        </thead>
        <tbody>
          {userProjects.created.map((project: any) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{project.status}</td>
              <td>{typeof project.daysRemaining === 'number' ? `${project.daysRemaining} días` : project.daysRemaining}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-4">Proyectos como Colaborador</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {userProjects.collaborator.map((project: any, index: number) => (
            <tr key={index}>
              <td>{project.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-4">Estadísticas de Colaboración</h2>
      <p><strong>Total de colaboraciones:</strong> {collaborationStats.totalCollaborations}</p>
      <p><strong>Colaboradores únicos:</strong> {collaborationStats.uniqueCollaborators}</p>
    </div>
  );

  return (
    <div>
      {userData?.role === 'admin' ? renderAdminDashboard() : renderUserDashboard()}
    </div>
  );
};

export default Dashboard;