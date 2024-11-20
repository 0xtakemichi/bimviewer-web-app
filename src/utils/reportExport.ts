import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface Project {
  name: string;
  description: string;
  status: string;
  daysRemaining: string | number;
}

interface ReportData {
  summary: {
    totalCreated: number;
    activeProjects: number;
    pendingProjects: number;
    finishedProjects: number;
    totalProjectTime: number;
  };
  userProjects: {
    created: Project[];
  };
}

/**
 * Exporta los datos del informe a un archivo PDF.
 * @param reportData Datos generados para el informe.
 */
export const exportToPDF = (reportData: ReportData) => {
  const doc = new jsPDF();

  doc.text('Informe de Gestión', 10, 10);
  doc.text(`Proyectos Totales: ${reportData.summary.totalCreated}`, 10, 20);
  doc.text(`Proyectos Activos: ${reportData.summary.activeProjects}`, 10, 30);
  doc.text(`Proyectos Pendientes: ${reportData.summary.pendingProjects}`, 10, 40);
  doc.text(`Proyectos Finalizados: ${reportData.summary.finishedProjects}`, 10, 50);
  doc.text(`Tiempo Total en Proyectos: ${reportData.summary.totalProjectTime.toFixed(2)} días`, 10, 60);

  doc.text('Proyectos Creados:', 10, 80);
  reportData.userProjects.created.forEach((project, index) => {
    doc.text(`${index + 1}. ${project.name} - ${project.status} (${project.daysRemaining} días restantes)`, 10, 90 + index * 10);
  });

  doc.save('informe_gestion.pdf');
};

/**
 * Exporta los datos del informe a un archivo CSV.
 * @param reportData Datos generados para el informe.
 */
export const exportToCSV = (reportData: ReportData) => {
  const projects = reportData.userProjects.created.map((project) => ({
    Nombre: project.name,
    Descripción: project.description,
    Estado: project.status,
    'Días Restantes': project.daysRemaining,
  }));

  const ws = XLSX.utils.json_to_sheet(projects);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Proyectos');
  XLSX.writeFile(wb, 'informe_gestion.csv');
};