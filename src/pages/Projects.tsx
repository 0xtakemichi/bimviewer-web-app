import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirección
import { ProjectsManager } from '../classes/ProjectsManager';
import { Project } from '../classes/Project';
import { useAuth } from '../hooks/AuthContext';
import { trackPageView } from '../helpers/analytics';
import { Modal, Button, Form, Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const ProjectsPage: React.FC = () => {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate(); // Hook para redirección
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

  const handleCardClick = (projectId: string) => {
    navigate(`/projects/viewer/${projectId}`); // Redirige al visor del proyecto con su ID
  };

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
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">My Projects</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search projects..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-md-end">
          <Button variant="primary" onClick={handleCreateProject}>
            Create New Project
          </Button>
        </Col>
      </Row>
      <Row>
        {projects
          .filter((project) =>
            project.name.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((project) => (
            <Col key={project.id} md={4} className="mb-4">
              <Card onClick={() => handleCardClick(project.id)} className="selectable-card">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <Card.Text>
                    <strong>Status:</strong> {project.status}
                  </Card.Text>
                  <Card.Text>
                    <strong>Role:</strong>{' '}
                    {project.owner === firebaseUser?.uid ? 'Owner' : 'Collaborator'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Collaborators:</strong>{' '}
                    {project.collaborators.join(', ') || 'None'}
                  </Card.Text>
                </Card.Body>
              </Card>
              <div className="text-end mt-1 me-3">
          <Button
            variant="outline-secondary"
            onClick={() => setSelectedProject(project)}
          >
            Editar
          </Button>
        </div>
            </Col>
          ))}
      </Row>

      {/* Modal for Editing Project */}
      <Modal show={!!selectedProject} onHide={() => setSelectedProject(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="projectName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedProject?.name || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={selectedProject?.description || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={selectedProject?.status || 'Pending'}
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Finished">Finished</option>
              </Form.Select>
            </Form.Group>

            {/* Add Collaborator */}
            <Button
              variant="outline-primary"
              className="mb-2"
              onClick={() => setShowAddCollaborator((prev) => !prev)}
            >
              {showAddCollaborator ? 'Cancel Add Collaborator' : 'Add Collaborator'}
            </Button>
            {showAddCollaborator && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Collaborator's email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                />
                <Button onClick={handleAddCollaborator} className="mt-2">
                  Add
                </Button>
              </Form.Group>
            )}

            {/* Remove Collaborator */}
            <Button
              variant="outline-danger"
              className="mb-2"
              onClick={() => setShowRemoveCollaborator((prev) => !prev)}
            >
              {showRemoveCollaborator ? 'Cancel Remove Collaborator' : 'Remove Collaborator'}
            </Button>
            {showRemoveCollaborator && (
              <Form.Group className="mb-3">
                <Form.Select
                  onChange={(e) => setSelectedCollaboratorUID(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a collaborator
                  </option>
                  {selectedProject?.collaborators.map((uid) => (
                    <option key={uid} value={uid}>
                      {uid}
                    </option>
                  ))}
                </Form.Select>
                <Button onClick={handleRemoveCollaborator} className="mt-2">
                  Remove
                </Button>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleEditProject}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => setSelectedProject(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProject}>
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectsPage;