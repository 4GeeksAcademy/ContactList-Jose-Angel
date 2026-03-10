import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout.jsx";
import ContactList from "./views/ContactList.jsx";
import ContactForm from "./views/ContactForm.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<ContactList />} />
      <Route path="/add" element={<ContactForm />} />
      <Route path="/edit/:id" element={<ContactForm />} />
    </Route>
  )
);
