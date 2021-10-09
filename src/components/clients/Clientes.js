import React, { useEffect, useState, Fragment, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import Spinner from "./../layout/Spinner";

// importar cliente axios
import clienteAxios from "../../config/axios";
import Cliente from "../clients/Cliente";

import { CRMContext } from "../../context/CRMContext";

function Clientes(props) {
  // trabajar con el state
  // clientes = state, guardarClietne = funcion para guardar el state
  const [clientes, guardarClientes] = useState([]);

  // utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  // use effect es similar a componentedidmount
  useEffect(() => {
    if (auth.token !== "") {
      // query al api
      const consultarAPI = async () => {
        try {
            const clientesConsulta = await clienteAxios.get("/clientes", {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              });
      
              // colocar el resultado en el state
              guardarClientes(clientesConsulta.data);
        } catch (error) {
            // error autorizacion
            if(error.response.status = 500) {
                props.history.push('/Login');
            }
        }
      };
      consultarAPI();
    } else {
        props.history.push('/Login')
    }

  }, [clientes]);

  // si el state esta false
  if(!auth.auth) {
      props.history.push('/Login')
  }

  if (!clientes.length) return <Spinner />;

  return (
    <Fragment>
      <h2>Clientes</h2>

      <Link to={"/cliente/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Cliente key={cliente._id} cliente={cliente} />
        ))}
      </ul>
    </Fragment>
  );
}
export default withRouter(Clientes);
