// Import necessary components from react-router-dom and other parts of the application.
import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.

export const Demo = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  const [inputValueName, setInputValueName] = useState('');
  const [inputValuePhone, setInputValuePhone] = useState('');
  const [inputValueEmail, setInputValueEmail] = useState('');
  const [inputValueAddress, setInputValueAddress] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (
      inputValueName.trim() &&
      inputValuePhone.trim() &&
      inputValueEmail.trim() &&
      inputValueAddress.trim())
    {
      dispatch({ 
        type: "ADD_CONTACT", 
        payload: {
          userName: inputValueName,
          phone: inputValuePhone,
          email: inputValueEmail,
          address: inputValueAddress
        } 
      });
      
      setInputValueName('');
      setInputValuePhone('')
      setInputValueEmail('')
      setInputValueAddress('')
    }
    else {
      return alert("Tienes que llenar todos los campos")
    }
  };


  return (
    <div className="container-inputs">
      <form  onSubmit={handleAddTodo} className="form-container">
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
              <button type="submit">Añadir contacto</button>
            </form>
      {/* Map over the 'todos' array from the store and render each item as a list element */}
      {store && store.contacts?.map((item) => {
        return (
          <div key={item.id} className="contact-card">
            </div>
        );
      })}
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
