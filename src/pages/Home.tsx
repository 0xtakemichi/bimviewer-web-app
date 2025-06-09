import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Button, Container, Alert } from 'react-bootstrap';
import Footer from '../components/Footer'; // Importar el nuevo Footer
import ServicesSection from '../components/ServicesSection'; // Importar la nueva sección de servicios
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

        <ServicesSection />


      </Container>
      <Footer />
    </div>
  );
};

export default Home;