export async function generateUserReport(uid: string) {
    const projectsCollection = collection(firestoreDb, 'Projects');
    
    // Proyectos creados
    const createdQuery = query(projectsCollection, where('owner', '==', uid));
    const createdSnapshot = await getDocs(createdQuery);
    
    // Proyectos como colaborador
    const collaboratorQuery = query(projectsCollection, where('collaborators', 'array-contains', uid));
    const collaboratorSnapshot = await getDocs(collaboratorQuery);
  
    let activeProjects = 0;
    let pendingProjects = 0;
    let finishedProjects = 0;
    let timeInStatus: Record<string, number> = {};
  
    const createdProjects = createdSnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.status === 'Active') activeProjects++;
      if (data.status === 'Pending') pendingProjects++;
      if (data.status === 'Finished') finishedProjects++;
      
      // Calcular tiempo por estado si existe statusHistory
      if (data.statusHistory) {
        const projectTimeInStatus = calculateTimeInStatus(data.statusHistory);
        for (const [status, time] of Object.entries(projectTimeInStatus)) {
          timeInStatus[status] = (timeInStatus[status] || 0) + time;
        }
      }
  
      return {
        id: doc.id,
        ...data,
      };
    });
  
    const collaboratorProjects = collaboratorSnapshot.docs.map((doc) => {
      const data = doc.data();
  
      // Calcular tiempo por estado para proyectos como colaborador
      if (data.statusHistory) {
        const projectTimeInStatus = calculateTimeInStatus(data.statusHistory);
        for (const [status, time] of Object.entries(projectTimeInStatus)) {
          timeInStatus[status] = (timeInStatus[status] || 0) + time;
        }
      }
  
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
      },
      timeInStatus, // Tiempo acumulado en cada estado
    };
  }