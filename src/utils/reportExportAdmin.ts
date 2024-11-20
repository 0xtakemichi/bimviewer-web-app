import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateAdminReport } from './adminReport';

export async function exportManagementReportPDF() {
  const report = await generateAdminReport();
  const doc = new jsPDF();

  // Título principal
  doc.setFontSize(18);
  doc.text('Informe de Gestión', 14, 20);

  doc.setFontSize(12);
  doc.text('Resumen de Usuarios:', 14, 30);

  // Resumen de usuarios
  const userSummary = [
    ['Total de Usuarios', report.users.totalUsers],
    ['Usuarios últimos 30 días', report.users.usersLastMonth],
    ['Usuarios Inactivos', report.users.inactiveUsers.length],
  ];

  autoTable(doc, {
    startY: 35,
    head: [['Métrica', 'Valor']],
    body: userSummary,
  });

  // Distribución de Roles
  doc.text('Distribución de Roles:', 14, doc.lastAutoTable.finalY + 10);
  const roleDistribution = Object.entries(report.users.roleDistribution).map(([role, count]) => [role, count]);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Rol', 'Cantidad']],
    body: roleDistribution,
  });

  // Resumen de Proyectos
  doc.text('Resumen de Proyectos:', 14, doc.lastAutoTable.finalY + 10);
  const projectSummary = [
    ['Total de Proyectos', report.projects.totalProjects],
    ['Proyectos últimos 30 días', report.projects.projectsLastMonth],
    ['Proyectos atrasados', report.projects.overdueProjects],
    ['Proyectos sin colaboradores', report.projects.projectsWithoutCollaborators],
    ['Duración promedio de proyectos finalizados (días)', report.projects.avgProjectDuration.toFixed(2)],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Métrica', 'Valor']],
    body: projectSummary,
  });

  // Top 5 Proyectos más colaborativos
  doc.text('Top 5 Proyectos con más Colaboradores:', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['ID', 'Nombre', 'Colaboradores']],
    body: report.projects.mostCollaborativeProjects.map((proj) => [proj.id, proj.name, proj.numCollaborators]),
  });

  // Top 5 Proyectos más activos
  doc.text('Top 5 Proyectos más Activos:', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['ID', 'Nombre', 'Actividad Reciente']],
    body: report.projects.mostActiveProjects.map((proj) => [proj.id, proj.name, proj.recentActivity]),
  });

  // Top 5 Proyectos más retrasados
  doc.text('Top 5 Proyectos más Retrasados:', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['ID', 'Nombre', 'Días de Retraso']],
    body: report.projects.mostDelayedProjects.map((proj) => [proj.id, proj.name, proj.delayDays]),
  });

  // Guardar PDF
  doc.save('Informe_de_Gestion.pdf');
}