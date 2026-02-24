import { json } from "react-router-dom"

export const initialStore = () => {
  return {
    message: null,
    contacts: [
      {
        userName: "Erwin Aguero",
        phone: "+38 02348512",
        email: "profeGuapo@gmail.com",
        address: "Su casa",
      }
    ],
  }
}
const SLUG = 'leo'
const AGENDA_OPERATIONS = 'https://playground.4geeks.com/contact/agendas/'
const CONTACTS_OPERATIONS = `https://playground.4geeks.com/agendas/${SLUG}/contacts`
export default async function storeReducer(store, action = {}) {
  switch (action.type) {

    case "ADD_CONTACT":
      console.log(store.payload);

      try {
        const createSlug = async () => {
          const res = await fetch(`${AGENDA_OPERATIONS}${SLUG}`,
            {
              method: "POST",              
            }
          )
          return await res.json()
        }
        //await createSlug()
        const createContact = async () => {
          const response = await fetch(`${CONTACTS_OPERATIONS}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: store.contacts
          })
          return await response.json()
        }
        //await createContact()
        return {
          ...store,
          contacts: [
            ...store.contacts,
            {
              ...action.payload
            }]
        };

      }

      catch (error) {
        throw new Error(error)
      }


    default:
      throw Error('Unknown action: ' + action.type);
  }
}
