import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import {
  addContact,
  clearErrorAction,
  createEmptyContact,
  getContactById,
  loadContacts,
  updateContact,
  validateContactData,
} from "../store.js";

const FORM_FIELDS = [
  {
    name: "name",
    label: "Nombre completo",
    type: "text",
    placeholder: "Escribe el nombre completo",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Escribe el email",
  },
  {
    name: "phone",
    label: "Telefono",
    type: "tel",
    placeholder: "Escribe el telefono",
  },
  {
    name: "address",
    label: "Direccion",
    type: "text",
    placeholder: "Escribe la direccion",
  },
];

const ContactForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const contactId = id ? Number(id) : null;
  const isEditMode = id !== undefined;
  const hasInvalidId = isEditMode && !Number.isInteger(contactId);

  const { store, dispatch } = useGlobalReducer();
  const {
    contacts,
    error,
    hasLoadedContacts,
    isLoadingContacts,
    isSavingContact,
  } = store;

  const [formData, setFormData] = useState(createEmptyContact);
  const [errors, setErrors] = useState({});

  const selectedContact =
    isEditMode && !hasInvalidId ? getContactById(contacts, contactId) : null;

  useEffect(() => {
    if (isEditMode || hasInvalidId) {
      return;
    }

    setFormData(createEmptyContact());
    setErrors({});
  }, [hasInvalidId, isEditMode]);

  useEffect(() => {
    if (!isEditMode || hasInvalidId || hasLoadedContacts || isLoadingContacts) {
      return;
    }

    void loadContacts(dispatch);
  }, [
    dispatch,
    hasInvalidId,
    hasLoadedContacts,
    isEditMode,
    isLoadingContacts,
  ]);

  useEffect(() => {
    if (!isEditMode || !selectedContact) {
      return;
    }

    setFormData({
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
      address: selectedContact.address,
    });
  }, [isEditMode, selectedContact]);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [name]: null,
      };
    });

    if (error) {
      dispatch(clearErrorAction());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateContactData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const didSave = isEditMode
      ? await updateContact(dispatch, contactId, formData)
      : await addContact(dispatch, formData);

    if (didSave) {
      navigate("/");
    }
  };

  if (hasInvalidId) {
    return (
      <section className="container py-5">
        <div className="contact-feedback-card text-center">
          <h1 className="h4 mb-2">ID de contacto invalido</h1>
          <p className="text-secondary mb-4">
            La ruta actual no apunta a un contacto valido.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver a contactos
          </Link>
        </div>
      </section>
    );
  }

  if (isEditMode && !hasLoadedContacts) {
    return (
      <section className="container py-5">
        <div className="contact-feedback-card text-center">
          {isLoadingContacts ? (
            <>
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading contact...</span>
              </div>
              <h1 className="h4">Cargando contacto...</h1>
              <p className="text-secondary mb-0">
                Obteniendo los datos antes de abrir el modo edicion.
              </p>
            </>
          ) : (
            <>
              <h1 className="h4">Todavia no se pudo cargar el contacto</h1>
              <p className="text-secondary mb-4">
                Recarga la agenda antes de editar este contacto.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => loadContacts(dispatch)}
              >
                Reintentar carga
              </button>
            </>
          )}
        </div>
      </section>
    );
  }

  if (isEditMode && hasLoadedContacts && !selectedContact) {
    return (
      <section className="container py-5">
        <div className="contact-feedback-card text-center">
          <h1 className="h4 mb-2">Contacto no encontrado</h1>
          <p className="text-secondary mb-4">
            El contacto seleccionado ya no esta disponible en esta agenda.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver a contactos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="contact-form-card card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
                <div>
                  <p className="text-uppercase small fw-semibold mb-2">
                    {isEditMode ? "Editar" : "Crear"}
                  </p>
                  <h1 className="h3 mb-1">
                    {isEditMode ? "Editar contacto" : "Agregar contacto"}
                  </h1>
                  <p className="text-secondary mb-0">
                    Todos los cambios se sincronizan con la API oficial.
                  </p>
                </div>
                <Link to="/" className="btn btn-outline-light">
                  Volver a la lista
                </Link>
              </div>

              {error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : null}

              <form noValidate onSubmit={handleSubmit}>
                <div className="row">
                  {FORM_FIELDS.map((field) => (
                    <div
                      key={field.name}
                      className={field.name === "address" ? "col-12 mb-3" : "col-md-6 mb-3"}
                    >
                      <label htmlFor={field.name} className="form-label">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                      />
                      {errors[field.name] ? (
                        <div className="invalid-feedback">{errors[field.name]}</div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
                  <Link to="/" className="btn btn-outline-secondary">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSavingContact}
                  >
                    {isSavingContact
                      ? "Guardando..."
                      : isEditMode
                        ? "Guardar cambios"
                        : "Guardar contacto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
