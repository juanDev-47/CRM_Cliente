import React, { useEffect, useState, Fragment, useContext } from "react";
import clienteAxios from "../../config/axios";

import DetallesPedido from "./DetallesPedido";
import { withRouter } from "react-router";
import Spinner from './../layout/Spinner';

import { CRMContext } from '../../context/CRMContext';

const Pedidos = (props) => {
  const [pedidos, guardarPedidos] = useState([]);

  const [auth, guardarAuth] = useContext( CRMContext );

  useEffect(() => {
    if(auth.token === '') {
      const consultarAPI = async () => {
        try {
          const resultado = await clienteAxios.get("/pedidos", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            }
          });
    
          guardarPedidos(resultado.data);
        } catch (error) {
          props.history.push('/Login')
        }
      };
  
      consultarAPI();
    } else {
      props.history.push('/Login')
    }
  }, [pedidos]);


  if(!auth.auth) {
    props.history.push('/Login')
}

// spinner de carga
    if(!pedidos.length) return <Spinner/>

  return (
    <Fragment>
      <h2>Pedidos</h2>

      <ul className="listado-pedidos">
        {pedidos.map(pedido => (
            <DetallesPedido 
                key={pedido._id}
                pedido={pedido}
            /> 
        ))}
      </ul>
    </Fragment>
  );
};

export default withRouter(Pedidos);
