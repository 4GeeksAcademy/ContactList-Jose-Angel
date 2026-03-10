import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ContactCard from "../components/ContactCard.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { loadContacts } from "../store.js";

const ContactList = () => {
  const { store, dispatch } = useGlobalReducer();
  const {
    contacts,
    error,
    hasLoadedContacts,
    isLoadingContacts,
    isSavingContact,
  } = store;
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }

    hasBootstrapped.current = true;
    void loadContacts(dispatch);
  }, [dispatch]);

  const isBusy = isLoadingContacts || isSavingContact;

  return (
    <section className="container py-5">
      <header className="contact-page-header mb-4">
        <div>
          <p className="text-uppercase small fw-semibold mb-2">Agenda API</p>
          <h1 className="display-6 fw-bold mb-2">Lista de contactos</h1>
          <p className="text-secondary mb-0">
            CRUD conectado a la API oficial de 4Geeks con un store global.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => loadContacts(dispatch)}
            disabled={isBusy}
          >
            {isLoadingContacts ? "Recargando..." : "Recargar"}
          </button>
          <Link to="/add" className="btn btn-success">
            Agregar contacto
          </Link>
        </div>
      </header>

      {error ? (
        <div
          className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => loadContacts(dispatch)}
            disabled={isBusy}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {isLoadingContacts && !hasLoadedContacts ? (
        <div className="contact-feedback-card text-center">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="h4 mb-2">Cargando contactos...</h2>
          <p className="text-secondary mb-0">
            Conectando con la agenda remota y sincronizando datos.
          </p>
        </div>
      ) : null}

      {hasLoadedContacts && contacts.length === 0 ? (
        <div className="contact-feedback-card text-center">
          <h2 className="h4 mb-2">No hay contactos todavia</h2>
          <p className="text-secondary mb-4">
            Crea el primer contacto y quedara guardado en la API.
          </p>
          <Link to="/add" className="btn btn-primary">
            Crear primer contacto
          </Link>
        </div>
      ) : null}

      <div className="contact-grid">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      {hasLoadedContacts && contacts.length > 0 ? (
        <footer className="text-center mt-4 text-secondary">
          Total de contactos: {contacts.length}
        </footer>
      ) : null}
    </section>
  );
};

export default ContactList;
