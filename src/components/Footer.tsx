import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Linkedin, Whatsapp, GeoAltFill, TelephoneFill, EnvelopeFill } from 'react-bootstrap-icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-light text-center text-lg-start mt-auto py-4">
      <Container>
        <Row className="align-items-center">
          <Col lg={4} md={4} className="mb-4 mb-lg-0">
            <h5 className="text-uppercase fw-bold">IngeBIM</h5>
            <p>
              Soluciones BIM para la optimización de tus proyectos de construcción.
            </p>
          </Col>

          <Col lg={4} md={4} className="mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold">Contacto</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <GeoAltFill className="me-2" /> Santiago de Chile
              </li>
              <li>
                <TelephoneFill className="me-2" /> <a href="tel:+56984230810" className="text-dark">+56 9 8423 0810</a>
              </li>
              <li>
                <TelephoneFill className="me-2" /> <a href="tel:+56992525535" className="text-dark">+56 9 9252 5535</a>
              </li>
              <li>
                <EnvelopeFill className="me-2" /> <a href="mailto:contacto@ingenieriabim.cl" className="text-dark">contacto@ingenieriabim.cl</a>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={4} className="mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold">Síguenos</h5>
            {/* Apply flex to stack buttons and align them responsively */}
            <div className="d-flex flex-column align-items-center align-items-lg-start">
              <Button variant="outline-primary" className="mb-2" href="https://www.linkedin.com/company/ingebim/" target="_blank" aria-label="LinkedIn">
                <Linkedin size={20} />
              </Button>
              <Button variant="outline-success" href="https://wa.me/56984230810" target="_blank" aria-label="WhatsApp">
                <Whatsapp size={20} />
              </Button>
            </div>
          </Col>
        </Row>
        <div className="text-center p-3 mt-4 border-top">
          © {new Date().getFullYear()} IngeBIM. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
