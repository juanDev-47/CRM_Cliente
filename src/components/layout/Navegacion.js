import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";

const Navegacion = () => { 

  const [auth, guardarAuth] = useContext(CRMContext);

  if(!auth.auth) return null

  return (
    <aside className="sidebar col-3">
    <h2>Administración</h2>

    
    <nav className="navegacion">
      <Link to={"/"} className="clientes">
        <i className="fas fa-users"></i> Clientes
      </Link>
      <Link to={"/productos"} className="productos">
        <i className="fas fa-boxes"></i> Productos
      </Link>
      <Link to={"/pedidos"} className="productos">
        <i className="fas fa-book"></i> Pedidos
      </Link>
    </nav>
  </aside>
  )
  
};

export default Navegacion;
