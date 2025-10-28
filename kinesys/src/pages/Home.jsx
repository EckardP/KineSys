import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      

      {/* Hero Section */}
      <section className="text-center py-5 bg-white">
        <div className="container">
          <h1 className="fw-bold mb-3">
            Sistema de Gestión para Clínicas de Fisioterapia
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Optimiza la gestión de tu clínica con <strong>KineSys</strong>.
            Administra pacientes, terapeutas, citas y tratamientos desde una
            única plataforma profesional.
          </p>

          <div className="mt-4">
            <button className="btn btn-dark btn-lg me-3">Comenzar</button>
            <Link to="/login" className="btn btn-outline-dark btn-lg">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-5 bg-light border-top">
        <div className="container text-center">
          <h3 className="fw-bold mb-4">Funcionalidades Principales</h3>
          <p className="text-muted mb-5">
            Todo lo que necesitas para gestionar tu clínica de fisioterapia de manera eficiente
          </p>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Gestión de Pacientes</h5>
                  <p className="card-text text-muted">
                    Registra y controla tus pacientes con facilidad. Acceso rápido a historiales, citas y tratamientos.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Gestión de Profesionales</h5>
                  <p className="card-text text-muted">
                    Administra tus fisioterapeutas, asigna tratamientos y controla horarios de trabajo fácilmente.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Terapias y Tratamientos</h5>
                  <p className="card-text text-muted">
                    Catálogo de terapias, tratamientos personalizados y registro de progreso clínico de tus pacientes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
