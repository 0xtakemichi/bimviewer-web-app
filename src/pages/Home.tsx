import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';

const Home = () => {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="home-container bg-light">
      <Container className="py-5">
        {/* Alerta de Novedades */}
        {showAlert && (
          <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>
            Explora nuestro visor web de modelos BIM en tu navegador.
          </Alert>
        )}

        {/* Sección de Bienvenida */}
        <section className="welcome-section text-center mb-5">
          <img
            src="/logo.png" // Ruta al logo en la carpeta public
            alt="IngeBIM Logo"
            className="mb-4" // Margen inferior para separar del texto
            style={{ height: '300px' }} // Ajusta el tamaño según necesites
          />
          <h1 className="display-4 fw-bold"></h1>
          <p className="lead">
            Soluciones en transformación digital para la industria de la ingeniería y construcción.
          </p>
          <Button variant="primary" size="lg" href="#services">
            Conoce Nuestros Servicios
          </Button>
        </section>

        {/* Carrusel Interactivo */}
        <Carousel className="mb-5">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/bim.png"
              alt="Primer Slide"
            />
            <Carousel.Caption>
              <h3>Modelación BIM</h3>
              <p>Transforma tus proyectos con precisión y eficiencia.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/recvirt.png "
              alt="Segundo Slide"
            />
            <Carousel.Caption>
              <h3>Animación 3D</h3>
              <p>Presenta tus proyectos de una manera visualmente impactante.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="animacion.png"
              alt="Tercer Slide"
            />
            <Carousel.Caption>
              <h3>Recorridos Virtuales</h3>
              <p>Explora tus proyectos en un entorno inmersivo.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* Servicios */}
        <section id="services" className="services-section mb-5">
          <h2 className="text-center mb-4">Nuestros Servicios</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Modelación</Card.Title>
                  <Card.Text>
                    Desde estructuras hasta aguas servidas, nuestro equipo te ofrece soluciones personalizadas.
                  </Card.Text>
                  {/* <Button variant="outline-primary">Saber Más</Button> */}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Animación 3D</Card.Title>
                  <Card.Text>
                    Muestra tus proyectos de infraestructura con impacto visual y claridad.
                  </Card.Text>
                  {/* <Button variant="outline-primary">Ver Ejemplos</Button> */}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Recorridos Virtuales</Card.Title>
                  <Card.Text>
                    Vive tus proyectos en primera persona con tecnología avanzada.
                  </Card.Text>
                  {/* <Button variant="outline-primary">Experimentar</Button> */}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Coordinación</Card.Title>
                  <Card.Text>
                    Gestión y coordinación BIM para proyectos de alta complejidad.
                  </Card.Text>
                  {/* <Button variant="outline-primary">Descubre Más</Button> */}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Interferencias</Card.Title>
                  <Card.Text>
                    Detección precisa de interferencias para evitar problemas en la ejecución.
                  </Card.Text>
                  {/* <Button variant="outline-primary">Más Información</Button> */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Información de Contacto */}
        <section className="contact-section text-center">
          <h2 className="mb-4">Contáctanos</h2>
          <p>Teléfonos:</p>
          <ul className="list-unstyled">
            <li><a href="tel:+56984230810">+56984230810</a></li>
            <li><a href="tel:+56992525535">+56992525535</a></li>
          </ul>
          <p>Email: <a href="mailto:contacto@ingenieriabim.cl">contacto@ingenieriabim.cl</a></p>
          <p>Ubicación: Santiago de Chile</p>
          <div className="social-media">
            <Button variant="outline-info" href="https://www.linkedin.com/company/ingebim/" target="_blank">
              LinkedIn
            </Button>{' '}
            <Button variant="outline-success" href="https://wa.me" target="_blank">
              WhatsApp
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Home;