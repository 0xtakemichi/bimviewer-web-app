import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Diagram3, Film, BadgeVr, People, ExclamationTriangle } from 'react-bootstrap-icons';

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="services-section mb-5">
      <h2 className="text-center mb-4">Nuestros Servicios</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title><Diagram3 size={25} className="me-2" />Modelación</Card.Title>
              <Card.Text>
                Desde estructuras hasta aguas servidas, nuestro equipo te ofrece soluciones personalizadas.
              </Card.Text>
              {/* <Button variant="outline-primary">Saber Más</Button> */}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title><Film size={25} className="me-2" />Animación 3D</Card.Title>
              <Card.Text>
                Muestra tus proyectos de infraestructura con impacto visual y claridad.
              </Card.Text>
              {/* <Button variant="outline-primary">Ver Ejemplos</Button> */}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title><BadgeVr size={25} className="me-2" />Recorridos Virtuales</Card.Title>
              <Card.Text>
                Vive tus proyectos en primera persona con tecnología avanzada.
              </Card.Text>
              {/* <Button variant="outline-primary">Experimentar</Button> */}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title><People size={25} className="me-2" />Coordinación</Card.Title>
              <Card.Text>
                Gestión y coordinación BIM para proyectos de alta complejidad.
              </Card.Text>
              {/* <Button variant="outline-primary">Descubre Más</Button> */}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title><ExclamationTriangle size={25} className="me-2" />Interferencias</Card.Title>
              <Card.Text>
                Detección precisa de interferencias para evitar problemas en la ejecución.
              </Card.Text>
              {/* <Button variant="outline-primary">Más Información</Button> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default ServicesSection;
