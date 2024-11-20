import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { generateUserReport } from '../utils/userReport';
import { exportToPDF, exportToCSV } from '../utils/reportExport';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard: React.FC = () => {
  const { userData, loading } = useAuth();
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    if (userData?.uid && userData.role === 'basic') {
      generateUserReport(userData.uid).then((data) => setReportData(data));
    } else if (userData?.role === 'admin') {
      console.log('Render de Admin');
    }
  }, [userData]);

  if (loading || !reportData) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  const { summary, userProjects, collaborationStats } = reportData;

  const renderAdminDashboard = () => (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard de Administrador</h1>
      <p>Bienvenido, {userData?.name} {userData?.lastName}.</p>
      <p>Rol: {userData?.role}</p>
      <button className="btn btn-primary mt-3">Generar Informe de Gestión</button>
    </div>
  );

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