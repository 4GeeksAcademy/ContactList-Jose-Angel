import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container py-2">
        <Link to="/" className="navbar-brand fw-semibold">
          Contact List
        </Link>
        <div className="ms-auto">
          <Link to="/add" className="btn btn-primary">
            Agregar contacto
          </Link>
        </div>
      </div>
    </nav>
  );
};
