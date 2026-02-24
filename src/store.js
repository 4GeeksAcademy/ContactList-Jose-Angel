export const initialStore=()=>{
  return{
    message: null,
    contacts: [
      {
        id:1,
        userName: "Erwin Aguero",
        phone: "+38 02348512",
        email: "profeGuapo@gmail.com",
        address: "Su casa",
      }
    ],
  }
}
export default function storeReducer(store, action = {}) {
  switch(action.type){
      case "ADD_CONTACT":
      return {
        ...store,
        contacts: [
          ...store.contacts,
          {
            id: Date.now(),
            ...action.payload
          }
        ]
      };
      
    default:
      throw Error('Unknown action: ' + action.type);
  }    
}
