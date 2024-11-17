import React, { useEffect, useState } from 'react';
import { ProjectsManager } from '../classes/ProjectsManager';
import { Project } from '../classes/Project';
import { useAuth } from '../hooks/AuthContext';

const ProjectsPage: React.FC = () => {
  const { firebaseUser } = useAuth();
  const [projectsManager, setProjectsManager] = useState<ProjectsManager | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [collaboratorEmail, setCollaboratorEmail] = useState<string>('');
  const [activeCollaboratorProject, setActiveCollaboratorProject] = useState<string | null>(null); // Nuevo estado para manejar el formulario de colaboradores
  const [selectedCollaboratorProject, setSelectedCollaboratorProject] = useState<string | null>(null);
  const [selectedCollaboratorUID, setSelectedCollaboratorUID] = useState<string | null>(null);
  

  useEffect(() => {
    if (firebaseUser) {
      const manager = new ProjectsManager(firebaseUser.uid);
      setProjectsManager(manager);

      manager.fetchProjects(firebaseUser.uid).then(() => {
        setProjects(manager.list);
        setLoading(false);
      });
    }
  }, [firebaseUser]);

  const handleCreateProject = async () => {
    if (!projectsManager || !firebaseUser) return;

    const newProjectData = {
      name: `Project ${Date.now()}`,
      description: 'New project description',
      status: 'Pending' as const,
      userRole: 'Architect' as const,
      finishDate: new Date(),
    };

    try {
      await projectsManager.newProject(newProjectData, firebaseUser.uid);
      setProjects([...projectsManager.list]); 
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = async () => {
    if (!selectedProject || !projectsManager) return;

    try {
      await projectsManager.updateProject(selectedProject.id, {
        name: selectedProject.name,
        description: selectedProject.description,
        status: selectedProject.status,
      });
      setProjects([...projectsManager.list]);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!projectsManager) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await projectsManager.deleteProject(id);
      setProjects([...projectsManager.list]); 
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleAddCollaborator = async (projectId: string) => {
    if (!projectsManager) return;
  
    try {
      await projectsManager.addCollaborator(projectId, collaboratorEmail);
      setProjects([...projectsManager.list]);
      alert('Collaborator added successfully!');
    } catch (error: any) {
      alert(error.message); // Muestra el mensaje específico del error
    } finally {
      setCollaboratorEmail(''); // Limpia el input
      setActiveCollaboratorProject(null); // Cierra el formulario
    }
  };


  const handleRemoveCollaborator = async (projectId: string) => {
    if (!projectsManager || !selectedCollaboratorUID) return;
  
    try {
      await projectsManager.removeCollaborator(projectId, selectedCollaboratorUID);
      setProjects([...projectsManager.list]);
      alert('Collaborator removed successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSelectedCollaboratorUID(null);
      setSelectedCollaboratorProject(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (selectedProject) {
      const { name, value } = e.target;
      setSelectedProject({ ...selectedProject, [name]: value });
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div>
      <h1>My Projects</h1>
      <button onClick={handleCreateProject}>Create New Project</button>
      <input
        type="text"
        placeholder="Search projects..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <ul>
        {projects.map((project) => (
            <li key={project.id}>
            <h3>{project.name}</h3>
            <p>Role: {project.owner === firebaseUser?.uid ? "Owner" : "Collaborator"}</p>
            <p>Status: {project.status}</p>
            <p>Collaborators: {project.collaborators.join(', ') || 'None'}</p>

            {project.owner === firebaseUser?.uid && (
                <>
                <button onClick={() => setSelectedProject(project)}>Edit</button>
                <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                <button onClick={() => setActiveCollaboratorProject(project.id)}>Add Collaborator</button>
                <button onClick={() => setSelectedCollaboratorProject(project.id)}>Remove Collaborator</button> {/* Nuevo botón */}
                </>
            )}

            {activeCollaboratorProject === project.id && (
                <div>
                <input
                    type="email"
                    placeholder="Collaborator's email"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                />
                <button onClick={() => handleAddCollaborator(project.id)}>Add</button>
                <button onClick={() => { setActiveCollaboratorProject(null); setCollaboratorEmail(''); }}>Cancel</button>
                </div>
            )}

            {/* Mostrar formulario para eliminar colaborador */}
            {selectedCollaboratorProject === project.id && (
                <div>
                <h4>Remove Collaborator</h4>
                <select
                    onChange={(e) => setSelectedCollaboratorUID(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Select a collaborator</option>
                    {project.collaborators.map(uid => (
                    <option key={uid} value={uid}>
                        {uid} {/* Puedes mapear el UID a un email si tienes esa información */}
                    </option>
                    ))}
                </select>
                <button onClick={() => handleRemoveCollaborator(project.id)}>Remove</button>
                <button onClick={() => setSelectedCollaboratorProject(null)}>Cancel</button>
                </div>
            )}
            </li>
        ))}
      </ul>
      

      {selectedProject && (
        <div>
          <h2>Edit Project</h2>
          <input
            type="text"
            name="name"
            value={selectedProject.name}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            value={selectedProject.description}
            onChange={handleInputChange}
          />
          <select
            name="status"
            value={selectedProject.status}
            onChange={handleInputChange}
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Finished">Finished</option>
          </select>
          <button onClick={handleEditProject}>Save Changes</button>
          <button onClick={() => setSelectedProject(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;