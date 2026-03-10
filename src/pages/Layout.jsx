import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";

export const Layout = () => {
  return (
    <ScrollToTop>
      <Navbar />
      <main className="contact-shell">
        <Outlet />
      </main>
      <Footer />
    </ScrollToTop>
  );
};
