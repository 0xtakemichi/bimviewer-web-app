import React, { useEffect, useState } from 'react';
import { ProjectsManager } from '../classes/ProjectsManager';
import { Project } from '../classes/Project';
import { useAuth } from '../hooks/AuthContext';
import '../styles/projects.css';
import { trackPageView } from '../helpers/analytics';

const ProjectsPage: React.FC = () => {
  const { firebaseUser } = useAuth();
  const [projectsManager, setProjectsManager] = useState<ProjectsManager | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [collaboratorEmail, setCollaboratorEmail] = useState<string>('');
  const [selectedCollaboratorUID, setSelectedCollaboratorUID] = useState<string | null>(null);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [showRemoveCollaborator, setShowRemoveCollaborator] = useState(false);

  useEffect(() => {
    if (firebaseUser) {
      trackPageView('Projects Page');
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
      createdAt: new Date(),
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

  const handleDeleteProject = async () => {
    if (!projectsManager || !selectedProject) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) return;

    try {
      await projectsManager.deleteProject(selectedProject.id);
      setProjects([...projectsManager.list]);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleAddCollaborator = async () => {
    if (!projectsManager || !selectedProject) return;

    try {
      await projectsManager.addCollaborator(selectedProject.id, collaboratorEmail);
      setProjects([...projectsManager.list]);
      alert('Collaborator added successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setCollaboratorEmail('');
      setShowAddCollaborator(false);
    }
  };

  const handleRemoveCollaborator = async () => {
    if (!projectsManager || !selectedProject || !selectedCollaboratorUID) return;

    try {
      await projectsManager.removeCollaborator(selectedProject.id, selectedCollaboratorUID);
      setProjects([...projectsManager.list]);
      alert('Collaborator removed successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSelectedCollaboratorUID(null);
      setShowRemoveCollaborator(false);
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
    <div className={selectedProject ? 'blur-background' : ''}>
      <div className='bar-projects'>
        <h1>My Projects</h1>
        <div className='input-search'>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className='new-project'>
          <button onClick={handleCreateProject} className='btn-new-project'>Create New Project</button>
        </div>
      </div>
      <div className="projects-grid">
        {projects
          .filter((project) =>
            project.name.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((project) => (
            <div key={project.id} className="project-card">
              <div className='card-title'>
                <h3>{project.name}</h3>
              </div>
              <hr />
              <p>{project.description}</p>
              <p className={`status ${project.status.toLowerCase()}`}>{project.status}</p>
              <p>Role: {project.owner === firebaseUser?.uid ? 'Owner' : 'Collaborator'}</p>
              <p>Collaborators: {project.collaborators.join(', ') || 'None'}</p>
              <p>{project.userRole}</p>
              {project.owner === firebaseUser?.uid && (
                <>
                  <button onClick={() => setSelectedProject(project)} className='btn-edit-project'>Edit</button>
                </>
              )}
            </div>
          ))}
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
            {/* <button onClick={handleEditProject}>Save Changes</button> */}
            {/* <button onClick={handleDeleteProject}>Delete Project</button> */}

            <button onClick={() => setShowAddCollaborator((prev) => !prev)}>
              {showAddCollaborator ? 'Cancel Add Collaborator' : 'Add Collaborator'}
            </button>
            {showAddCollaborator && (
              <div>
                <input
                  type="email"
                  placeholder="Collaborator's email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                />
                <button onClick={handleAddCollaborator}>Add</button>
              </div>
            )}

            <button onClick={() => setShowRemoveCollaborator((prev) => !prev)}>
              {showRemoveCollaborator ? 'Cancel Remove Collaborator' : 'Remove Collaborator'}
            </button>
            {showRemoveCollaborator && (
              <div>
                <select
                  onChange={(e) => setSelectedCollaboratorUID(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a collaborator
                  </option>
                  {selectedProject.collaborators.map((uid) => (
                    <option key={uid} value={uid}>
                      {uid}
                    </option>
                  ))}
                </select>
                <button onClick={handleRemoveCollaborator}>Remove</button>
              </div>
            )}
            <br />
            <br />
            <button onClick={handleEditProject} className="btn btn-success">Save Changes</button>
            <button onClick={() => setSelectedProject(null)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleDeleteProject} className="btn btn-danger">Delete Project</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;