import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestoreDb } from '../firebase/index';

export async function generateAdminReport() {
  const usersCollection = collection(firestoreDb, 'Users');
  const projectsCollection = collection(firestoreDb, 'Projects');

  // Consultar todos los usuarios
  const usersSnapshot = await getDocs(usersCollection);
  const projectsSnapshot = await getDocs(projectsCollection);

  // Consultar proyectos por estado utilizando Firestore queries
  const pendingProjectsQuery = query(projectsCollection, where('status', '==', 'Pending'));
  const activeProjectsQuery = query(projectsCollection, where('status', '==', 'Active'));
  const finishedProjectsQuery = query(projectsCollection, where('status', '==', 'Finished'));

  const [pendingProjectsSnapshot, activeProjectsSnapshot, finishedProjectsSnapshot] = await Promise.all([
    getDocs(pendingProjectsQuery),
    getDocs(activeProjectsQuery),
    getDocs(finishedProjectsQuery),
  ]);

  // 1. Usuarios
  const totalUsers = usersSnapshot.size;

  const roleDistribution = usersSnapshot.docs.reduce((acc: Record<string, number>, doc) => {
    const user = doc.data();
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const usersLastMonth = usersSnapshot.docs.filter((doc) => {
    const user = doc.data();
    const lastLogin = user.lastLoginAt?.toDate();
    return lastLogin && lastLogin > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }).length;

  const usersByCountry = usersSnapshot.docs.reduce((acc: Record<string, number>, doc) => {
    const user = doc.data();
    const country = user.country || 'Desconocido';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  const usersByCompany = usersSnapshot.docs.reduce((acc: Record<string, number>, doc) => {
    const user = doc.data();
    const company = user.company ? capitalizeFirstLetter(user.company) : 'Sin Empresa'; // Capitalizar
    acc[company] = (acc[company] || 0) + 1;
    return acc;
  }, {});

  // 2. Proyectos
  const totalProjects = projectsSnapshot.size;

  let projectsWithoutCollaborators = 0;
  let totalCollaborators = 0;
  let totalFinishedProjectDuration = 0;
  let finishedProjectsCount = 0;

  const mostCollaborativeProjects = projectsSnapshot.docs.map((doc) => {
    const project = doc.data();
    const numCollaborators = project.collaborators?.length || 0;

    if (!project.collaborators || numCollaborators === 0) {
      projectsWithoutCollaborators++;
    } else {
      totalCollaborators += numCollaborators;
    }

    if (project.status === 'Finished' && project.createdAt && project.finishDate) {
      const duration = (project.finishDate.toDate() - project.createdAt.toDate()) / (1000 * 60 * 60 * 24);
      totalFinishedProjectDuration += duration;
      finishedProjectsCount++;
    }

    return {
      id: doc.id,
      name: project.name,
      numCollaborators,
    };
  }).sort((a, b) => b.numCollaborators - a.numCollaborators).slice(0, 5);

  const avgCollaboratorsPerProject = totalProjects > 0 ? totalCollaborators / totalProjects : 0;
  const avgProjectDuration = finishedProjectsCount > 0 ? totalFinishedProjectDuration / finishedProjectsCount : 0;

  const overdueProjects = projectsSnapshot.docs.filter((doc) => {
    const project = doc.data();
    const finishDate = project.finishDate?.toDate();
    return finishDate && finishDate < new Date() && project.status !== 'Finished';
  }).length;

  const projectsLastMonth = projectsSnapshot.docs.filter((doc) => {
    const project = doc.data();
    const createdAt = project.createdAt?.toDate();
    return createdAt && createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }).length;

  //--------------------------------
  const mostActiveProjects = projectsSnapshot.docs
  .map((doc) => {
    const project = doc.data();
    const recentActivity = project.activityLogs?.filter((log: any) => {
      const logDate = log.timestamp?.toDate();
      return logDate && logDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }).length || 0;

    return {
      id: doc.id,
      name: project.name,
      recentActivity,
    };
  })
  .sort((a, b) => b.recentActivity - a.recentActivity)
  .slice(0, 5); // Top 5 proyectos más activos

  const inactiveUsers = usersSnapshot.docs.filter((doc) => {
    const user = doc.data();
    const lastLogin = user.lastLogin?.toDate(); // Convertir Timestamp a Date
    return !lastLogin || lastLogin > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // Últimos 60 días
  }).map((doc) => ({
    id: doc.id,
    name: `${doc.data().name} ${doc.data().lastName}`,
    lastLogin: doc.data().lastLogin?.toDate()?.toLocaleString() || 'Nunca', // Mostrar como string legible
  }));

  const mostDelayedProjects = projectsSnapshot.docs
  .filter((doc) => {
    const project = doc.data();
    const finishDate = project.finishDate?.toDate();
    return finishDate && finishDate < new Date() && project.status !== 'Finished';
  })
  .map((doc) => {
    const project = doc.data();
    const finishDate = project.finishDate.toDate();
    const delayDays = Math.ceil((Date.now() - finishDate) / (1000 * 60 * 60 * 24));
    return {
      id: doc.id,
      name: project.name,
      delayDays,
    };
  })
  .sort((a, b) => b.delayDays - a.delayDays)
  .slice(0, 5); // Top 5 proyectos más retrasados

  const usersGrowth = usersSnapshot.docs.reduce((acc: Record<string, number>, doc) => {
    const user = doc.data();
    const createdAt = user.createdAt?.toDate();
    const month = createdAt ? `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}` : 'Desconocido';
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const completionRate = totalProjects > 0 
  ? (finishedProjectsSnapshot.size / totalProjects) * 100 
  : 0;

  //--------------------------------
  return {
    users: {
      totalUsers,
      roleDistribution,
      usersLastMonth,
      byCountry: usersByCountry,
      byCompany: usersByCompany,
      inactiveUsers,
    },
    projects: {
      totalProjects,
      projectStatusDistribution: {
        Pending: pendingProjectsSnapshot.size,
        Active: activeProjectsSnapshot.size,
        Finished: finishedProjectsSnapshot.size,
      },
      projectsWithoutCollaborators,
      avgCollaboratorsPerProject,
      overdueProjects,
      projectsLastMonth,
      avgProjectDuration,
      mostCollaborativeProjects,
      mostActiveProjects,
      mostDelayedProjects,
      usersGrowth,
      completionRate,
    },
  };
}