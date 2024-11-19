import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestoreDb } from '../firebase/index';
import { IProject } from '../classes/Project'; // Importar el tipo correcto


function calculateDaysRemaining(project: { finishDate?: any }) {
  if (!project.finishDate) {
    return 'Sin plazo'; // No hay fecha de finalización
  }

  const finishDate = project.finishDate.toDate 
    ? project.finishDate.toDate().getTime() 
    : new Date(project.finishDate).getTime();

  const currentDate = Date.now();
  const daysRemaining = (finishDate - currentDate) / (1000 * 60 * 60 * 24);

  return daysRemaining > 0 ? Math.ceil(daysRemaining) : 'Finalizado';
}

// Calcular duraciones de proyectos usando createdAt y finishDate
function calculateProjectDurations(project: { createdAt: any; finishDate?: any }) {
  const createdAt = project.createdAt.toDate 
    ? project.createdAt.toDate().getTime() 
    : new Date(project.createdAt).getTime(); // Convierte Timestamp a Date si es necesario
  
  const finishDate = project.finishDate 
    ? (project.finishDate.toDate 
        ? project.finishDate.toDate().getTime() 
        : new Date(project.finishDate).getTime()) 
    : Date.now(); 

  const totalTime = (finishDate - createdAt) / (1000 * 60 * 60 * 24); // Total en días
  return { totalTime };
}

export async function generateUserReport(uid: string) {
  // Consultar todos los proyectos creados por el usuario
  const projectsCollection = collection(firestoreDb, 'Projects');
  const createdQuery = query(projectsCollection, where('owner', '==', uid));
  const createdSnapshot = await getDocs(createdQuery);

  // Consultar todos los proyectos donde el usuario es colaborador
  const collaboratorQuery = query(projectsCollection, where('collaborators', 'array-contains', uid));
  const collaboratorSnapshot = await getDocs(collaboratorQuery);

  let activeProjects = 0;
  let pendingProjects = 0;
  let finishedProjects = 0;

  let totalProjectTime = 0; // Tiempo total en proyectos

  // Procesar proyectos creados
  const createdProjects = createdSnapshot.docs.map((doc) => {
    const data = doc.data() as IProject; // Asignación de tipo IProject
    if (data.status === 'Active') activeProjects++;
    if (data.status === 'Pending') pendingProjects++;
    if (data.status === 'Finished') finishedProjects++;

    // Calcular duraciones para el proyecto
    const { totalTime } = calculateProjectDurations(data);
    totalProjectTime += totalTime;

    return {
      id: doc.id,
      daysRemaining: calculateDaysRemaining(data),
      ...data,
    };
  });

  // Procesar proyectos como colaborador
  const collaboratorProjects = collaboratorSnapshot.docs.map((doc) => {
    const data = doc.data() as IProject; // Asignación de tipo IProject

    // Calcular duraciones para proyectos donde el usuario colabora
    const { totalTime } = calculateProjectDurations(data);
    totalProjectTime += totalTime;

    return data;
  });

  return {
    userProjects: {
      created: createdProjects,
      collaborator: collaboratorProjects,
    },
    collaborationStats: {
      totalCollaborations: collaboratorProjects.length,
      uniqueCollaborators: new Set(
        collaboratorProjects.flatMap((project) => project.collaborators)
      ).size,
    },
    summary: {
      totalCreated: createdProjects.length,
      totalCollaborator: collaboratorProjects.length,
      activeProjects,
      pendingProjects,
      finishedProjects,
      totalProjectTime,
    },
  };
}