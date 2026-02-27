// Import necessary components from react-router-dom and other parts of the application.
import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.
import { ACTION_TYPES, addContactAction } from "../store";

export const Demo = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  const [inputValueName, setInputValueName] = useState('');
  const [inputValuePhone, setInputValuePhone] = useState('');
  const [inputValueEmail, setInputValueEmail] = useState('');
  const [inputValueAddress, setInputValueAddress] = useState('');

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (
      inputValueName.trim() &&
      inputValuePhone.trim() &&
      inputValueEmail.trim() &&
      inputValueAddress.trim()) {
      try {
        const savedContact = await addContactAction({
          userName: inputValueName,
          phone: inputValuePhone,
          email: inputValueEmail,
          address: inputValueAddress
        })

        dispatch({
          type: ACTION_TYPES.ADD_CONTACT,
          payload: savedContact
        })
        dispatch({ type: ACTION_TYPES.SET_MESSAGE, payload: "Contacto creado correctamente" })

        setInputValueName('');
        setInputValuePhone('')
        setInputValueEmail('')
        setInputValueAddress('')
      } catch (error) {
        alert(error.message || "No se pudo crear el contacto")
      }
    }
    else {
      return alert("Tienes que llenar todos los campos")
    }
  };


  return (
    
    <div className="container-inputs">
      <form onSubmit={handleAddTodo} className="form-container">
        <input type="text"
          placeholder="Nombre"
          className="input"
          value={inputValueName}
          onChange={(e) => setInputValueName(e.target.value)}
        />
        <input type="tel"
          placeholder="Phone"
          className="input"
          value={inputValuePhone}
          //oninput={this.value = this.value.replace(/[^0-9]/g, '')}
          onChange={(e) => setInputValuePhone(e.target.value)}
        />
        <input type="email"
          placeholder="Email"
          className="input"
          value={inputValueEmail}
          onChange={(e) => setInputValueEmail(e.target.value)}
        />
        <input type="text"
          placeholder="Address"
          className="input"
          value={inputValueAddress}
          onChange={(e) => setInputValueAddress(e.target.value)}
        />
        <button type="submit" className="submit">Añadir contacto</button>
      </form>
      {/* Map over the 'todos' array from the store and render each item as a list element */}
      <Link to="/">
        <button>Back home</button>
      </Link>
      {store && store.contacts?.map((item) => {
        return (
          <div key={item.id} className="contact-card"></div>
        );
      })}
    </div>
  );
};
