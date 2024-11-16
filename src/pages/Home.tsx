import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Sección de Bienvenida */}
      <section className="welcome-section">
        <h1>IngeBIM</h1>
        <p>Soluciones en transformación digital para la industria de la ingeniería y construcción.</p>
      </section>

      {/* Servicios */}
      <section className="services-section">
        <h2>Servicios</h2>
        <div className="services-list">
          <div className="service-item">
            <h3>Modelación</h3>
            <ul>
              <li>Estructuras</li>
              <li>Vialidad</li>
              <li>Luminarias</li>
              <li>Seguridad vial</li>
              <li>Defensas fluviales</li>
              <li>Paisajismo</li>
              <li>Aguas servidas</li>
              <li>Agua potable</li>
              <li>Entre otros</li>
            </ul>
          </div>
          <div className="service-item">
            <h3>Animación 3D</h3>
            <ul>
              <li>Video animación</li>
              <li>Proyectos de infraestructura</li>
              <li>Entre otros</li>
            </ul>
          </div>
          <div className="service-item">
            <h3>Recorridos Virtuales</h3>
            <ul>
              <li>Visualización en primera persona</li>
              <li>Variedad de avatares</li>
              <li>Simulación de conducción</li>
              <li>Recorrido virtual</li>
              <li>Entre otros</li>
            </ul>
          </div>
          <div className="service-item">
            <h3>Coordinación</h3>
            <ul>
              <li>Coordinación BIM (BIM manager-coordinador BIM)</li>
              <li>Revisores BIM</li>
              <li>Interoperabilidad</li>
              <li>Información de modelos (LOD 100, LOD 200, LOD 300 y LOD 400)</li>
            </ul>
          </div>
          <div className="service-item">
            <h3>Interferencias</h3>
            <ul>
              <li>Detección de interferencias en modelos</li>
              <li>Revisión de modelos</li>
              <li>Detección de inconsistencias geométricas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="contact-section">
        <h2>Contáctanos</h2>
        <p>Teléfonos:</p>
        <ul>
          <li><a href="tel:+56984230810">+56984230810</a></li>
          <li><a href="tel:+56992525535">+56992525535</a></li>
        </ul>
        <p>Email: <a href="mailto:contacto@ingenieriabim.cl">contacto@ingenieriabim.cl</a></p>
        <p>Ubicación: Santiago de Chile</p>
        <div className="social-media">
          <a href="https://wa.me" target="_blank" rel="noopener noreferrer">Linkedin</a>
          <a href="https://wa.me" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </section>
    </div>
  );
};

export default Home;