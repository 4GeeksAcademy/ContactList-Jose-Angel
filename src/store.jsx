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
export const SLUG = "leo"
export const AGENDA_OPERATIONS = "https://playground.4geeks.com/contact/agendas/"
export const CONTACTS_OPERATIONS = `https://playground.4geeks.com/contact/agendas/${SLUG}/contacts`
export const ACTION_TYPES = {
  ADD_CONTACT: "ADD_CONTACT",
  SET_MESSAGE: "SET_MESSAGE",
}

const createAgenda = async () => {
  const response = await fetch(`${AGENDA_OPERATIONS}${SLUG}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (response.ok) return

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  const detail = payload?.detail || payload?.msg || ""
  // Si el servidor responde 400 y el mensaje indica "already exists",
  // significa que la agenda ya estaba creada y podemos continuar sin error.
  const alreadyExists = response.status === 400 && /exists|already/i.test(detail)

  if (!alreadyExists) {
    throw new Error(detail || "No se pudo crear la agenda")
  }
}

const createContactRequest = async ({ userName, phone, email, address }) => {
  const response = await fetch(CONTACTS_OPERATIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userName,
      phone,
      email,
      address,
    }),
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  return { response, payload }
}

const isAgendaMissingError = (response, payload) => {
  const detail = payload?.detail || payload?.msg || ""
  // Aquí usamos .test(...) para buscar palabras clave en el mensaje de error.
  // Si encuentra "agenda", "not found" o "does not exist", asumimos que la agenda no existe.
  return response.status === 404 || /agenda|not found|does not exist/i.test(String(detail))
}

export const addContactAction = async ({ userName, phone, email, address }) => {
  let { response, payload } = await createContactRequest({ userName, phone, email, address })

  if (!response.ok && isAgendaMissingError(response, payload)) {
    await createAgenda()
    const retry = await createContactRequest({ userName, phone, email, address })
    response = retry.response
    payload = retry.payload
  }

  if (!response.ok) {
    const detail = payload?.detail || payload?.msg || "No se pudo crear el contacto"
    throw new Error(detail)
  }

  return {
    id: payload?.id,
    userName: payload?.name || userName,
    phone: payload?.phone || phone,
    email: payload?.email || email,
    address: payload?.address || address,
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case ACTION_TYPES.ADD_CONTACT:
      return {
        ...store,
        contacts: [
          ...store.contacts,
          {
            ...action.payload,
          },
        ],
      }

    case ACTION_TYPES.SET_MESSAGE:
      return {
        ...store,
        message: action.payload ?? null,
      }

    default:
      throw Error('Unknown action: ' + action.type);
  }
}
