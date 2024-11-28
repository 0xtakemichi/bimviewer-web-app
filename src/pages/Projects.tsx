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
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    status: 'Active' as 'Pending' | 'Active' | 'Finished',
    userRole: 'Architect' as 'Architect' | 'Engineer' | 'Developer',
    finishDate: new Date(),
    createdAt: new Date(),
  });

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

  const handleCreateProjectWithData = async () => {
    if (!projectsManager || !firebaseUser) return;
  
    try {
      await projectsManager.newProject(newProjectData, firebaseUser.uid);
      setProjects([...projectsManager.list]);
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
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
      console.error('Error al actualizar el proyecto:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectsManager || !selectedProject) return;

    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este proyecto?');
    if (!confirmDelete) return;

    try {
      await projectsManager.deleteProject(selectedProject.id);
      setProjects([...projectsManager.list]);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
    }
  };

  const handleAddCollaborator = async () => {
    if (!projectsManager || !selectedProject) return;

    try {
      await projectsManager.addCollaborator(selectedProject.id, collaboratorEmail);
      setProjects([...projectsManager.list]);
      alert('Colaborador añadido con éxito');
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
      alert('Colaborador eliminado con éxito');
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
          <h1 className="text-center">Mis Proyectos</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar proyectos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-md-end">
          <Button variant="primary" onClick={() => setShowCreateProjectModal(true)}>
            Crear Nuevo Proyecto
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
                  <Card.Title className='text-center'>{project.name}</Card.Title>
                  <hr />
                  <Card.Text>{project.description}</Card.Text>
                  <Card.Text>
                    <strong>Estado:</strong> {project.status}
                  </Card.Text>
                  <Card.Text>
                    <strong>Rol de usuario:</strong>{' '}
                    {project.owner === firebaseUser?.uid ? 'Owner' : 'Collaborator'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Colaboradores:</strong>{' '}
                    {project.collaborators.join(', ') || 'None'}
                  </Card.Text>
                </Card.Body>
              </Card>
              <div className="text-end mt-1 me-0">
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
          <Modal.Title>Editar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="projectName">
              <Form.Label>Nombre del Proyecto</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedProject?.name || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={selectedProject?.description || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectStatus">
              <Form.Label>Estado</Form.Label>
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
              {showAddCollaborator ? 'Cancelar Agregar Colaborador' : 'Agregar Colaborador'}
            </Button>
            {showAddCollaborator && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Ingrese correo electrónico del colaborador"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                />
                <Button onClick={handleAddCollaborator} className="mt-2">
                  Agregar
                </Button>
              </Form.Group>
            )}

            {/* Remove Collaborator */}
            <Button
              variant="outline-danger"
              className="mb-2"
              onClick={() => setShowRemoveCollaborator((prev) => !prev)}
            >
              {showRemoveCollaborator ? 'Cancelar Eliminar Colaborador' : 'Eliminar Colaborador'}
            </Button>
            {showRemoveCollaborator && (
              <Form.Group className="mb-3">
                <Form.Select
                  onChange={(e) => setSelectedCollaboratorUID(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecciona un colaborador
                  </option>
                  {selectedProject?.collaborators.map((uid) => (
                    <option key={uid} value={uid}>
                      {uid}
                    </option>
                  ))}
                </Form.Select>
                <Button onClick={handleRemoveCollaborator} className="mt-2">
                  Eliminar Colaborador
                </Button>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleEditProject}>
            Guardar Cambios
          </Button>
          <Button variant="secondary" onClick={() => setSelectedProject(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProject}>
            Eliminar Proyecto
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showCreateProjectModal} onHide={() => setShowCreateProjectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="newProjectName">
              <Form.Label>Nombre del Proyecto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese nombre del proyecto"
                value={newProjectData.name}
                onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newProjectDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Ingrese una descripción"
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newProjectStatus">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                aria-label="Select project status"
                value={newProjectData.status}
                onChange={(e) => setNewProjectData({ ...newProjectData, status: e.target.value as 'Pending' | 'Active' | 'Finished' })}
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Finished">Finished</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Seleccione el estado actual del proyecto
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="newProjectRole">
              <Form.Label>Rol de Usuario</Form.Label>
              <Form.Select
                aria-label="Select user role"
                value={newProjectData.userRole}
                onChange={(e) => setNewProjectData({ ...newProjectData, userRole: e.target.value as 'Architect' | 'Engineer' | 'Developer' })}
              >
                <option value="Architect">Architect</option>
                <option value="Engineer">Engineer</option>
                <option value="Developer">Developer</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Seleccione el rol asignado al usuario para este proyecto.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="newProjectFinishDate">
              <Form.Label>Fecha de Finalización</Form.Label>
              <Form.Control
                type="date"
                value={newProjectData.finishDate.toISOString().split('T')[0]}
                onChange={(e) => setNewProjectData({ ...newProjectData, finishDate: new Date(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateProjectModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              await handleCreateProjectWithData();
              setShowCreateProjectModal(false);
            }}
          >
            Crear Proyecto
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectsPage;