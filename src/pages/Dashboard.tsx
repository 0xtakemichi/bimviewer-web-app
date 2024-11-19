import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { generateUserReport } from '../utils/userReport';

const Dashboard: React.FC = () => {
  const { userData, loading } = useAuth();
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    if (userData?.uid && userData.role === 'basic') {
      generateUserReport(userData.uid).then((data) => setReportData(data));
    } else if (userData?.role === 'admin') {
      // Aquí podrías llamar a otra función de reportes globales si tienes una para el administrador
      console.log('Render de Admin');
    }
  }, [userData]);

  if (loading || !reportData) {
    return <div>Cargando...</div>;
  }

  const { summary, userProjects, collaborationStats } = reportData;

  // Contenido para administradores
  const renderAdminDashboard = () => (
    <div>
      <h1>Dashboard de Administrador</h1>
      <p>Bienvenido, {userData?.name} {userData?.lastName}.</p>
      <p>Rol: {userData?.role}</p>
      {/* Aquí se agregarían las herramientas de administración */}
      <button>Generar Informe de Gestión</button>
    </div>
  );

  // Contenido para usuarios básicos
  const renderUserDashboard = () => (
    <div>
      <h1>Informe de Usuario Básico</h1>
      <p>Nombre: {userData?.name} {userData?.lastName}</p>
      <p>Empresa: {userData?.company}</p>
      <p>Proyectos Totales: {summary.totalCreated}</p>
      <p>Proyectos Activos: {summary.activeProjects}</p>
      <p>Proyectos Pendientes: {summary.pendingProjects}</p>
      <p>Proyectos Finalizados: {summary.finishedProjects}</p>
      <p>Tiempo Total en Proyectos: {summary.totalProjectTime.toFixed(2)} días</p>
      <p>Tiempo Promedio por Proyecto: {(summary.totalProjectTime / summary.totalCreated).toFixed(2)} días</p>

      <h2>Proyectos Creados</h2>
      {userProjects.created.map((project: any) => (
        <div key={project.id}>
          <p>Nombre: {project.name}</p>
          <p>Descripción: {project.description}</p>
          <p>Estado: {project.status}</p>
          <p>Días Restantes: {typeof project.daysRemaining === 'number' ? `${project.daysRemaining} días` : project.daysRemaining}</p>
        </div>
      ))}

      <h2>Proyectos como Colaborador</h2>
      {userProjects.collaborator.map((project: any, index: number) => (
        <div key={index}>
          <p>Nombre: {project.name}</p>
        </div>
      ))}

      <h2>Estadísticas de Colaboración</h2>
      <p>Total de colaboraciones: {collaborationStats.totalCollaborations}</p>
      <p>Colaboradores únicos: {collaborationStats.uniqueCollaborators}</p>
    </div>
  );

  return (
    <div>
      {userData?.role === 'admin' ? renderAdminDashboard() : renderUserDashboard()}
    </div>
  );
};

export default Dashboard;