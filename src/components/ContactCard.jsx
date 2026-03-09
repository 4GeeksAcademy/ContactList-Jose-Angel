import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { deleteContact } from "../store.js";

const getContactInitial = (contactName = "") =>
  contactName.trim().charAt(0).toUpperCase() || "?";

const ContactCard = ({ contact }) => {
  const { store, dispatch } = useGlobalReducer();
  const { isLoadingContacts, isSavingContact } = store;
  const isBusy = isLoadingContacts || isSavingContact;

  const handleDelete = async () => {
    const confirmed = window.confirm(`Quieres borrar a ${contact.name}?`);

    if (!confirmed) {
      return;
    }

    await deleteContact(dispatch, contact.id);
  };

  return (
    <article className="contact-card">
      <div className="contact-card__main">
        <div className="contact-avatar" aria-hidden="true">
          {getContactInitial(contact.name)}
        </div>

        <div className="contact-card__content">
          <h2 className="h5 mb-2">{contact.name}</h2>
          <p className="mb-2">
            <span className="contact-detail-label">Email</span>
            {contact.email}
          </p>
          <p className="mb-2">
            <span className="contact-detail-label">Telefono</span>
            {contact.phone}
          </p>
          <p className="mb-0">
            <span className="contact-detail-label">Direccion</span>
            {contact.address}
          </p>
        </div>
      </div>

      <div className="contact-card__actions">
        <Link
          to={`/edit/${contact.id}`}
          className="btn btn-outline-light btn-sm"
          aria-label={`Editar ${contact.name}`}
        >
          Editar
        </Link>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={handleDelete}
          disabled={isBusy}
          aria-label={`Borrar ${contact.name}`}
        >
          Borrar
        </button>
      </div>
    </article>
  );
};

ContactCard.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default ContactCard;
