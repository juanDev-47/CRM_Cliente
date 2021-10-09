import React, { Fragment, useState, useContext } from "react";
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import clienteAxion from '../../config/axios'

import { CRMContext } from "../../context/CRMContext";

const NuevoCliente = ({history}) => {

  // utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

    // cliente = state, guardarcliente = funcion para guardar el state
  const [cliente, guardarCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  // leer los datos del formulario
  const actualizarState = e => {
      // almacenar lo que el usuario escribe en le state
      guardarCliente({
        // obtener una copia del state actual
        ...cliente, 
        [e.target.name] : e.target.value
      });

  }

  // limpiando el formulario
  

  // añande en la rest api un cliente nuevo
  const agregarCliente = e => {
      e.preventDefault();

      // enviar peticion
      clienteAxion.post('/clientes', cliente)
        .then(res => {
            // validar si hay errores en mongo
            if(res.data.code === 11000) {
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error!',
                    text: 'Ese cliente ya esta registrado!'
                })
            } else {
                Swal.fire(
                    'Se ha agregado exitosamente!',
                    res.data.mensaje,
                    'success'
                )
                // redireccionar
                history.push('/');
            }

            // redireccionar
            
        });

  }

  // validar el formulario
  const validarCliente = () => {
      // destructuring
      const { nombre, apellido, empresa, email, telefono} = cliente;

      // revisar que las propiedades del state tengan contenido
      let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;

      // return true o false
      return valido;
  }

  // verificar si esta autenticado 
  if(!auth.auth) {
    history.push('/Login');
  }

  return (
    <Fragment>
      <h2>Nuevo Cliente</h2>
      <form onSubmit={agregarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input type="tel" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </Fragment>
  );
};

// HOC, es una funcion que toma un componente y retorna un nuevo componente
export default withRouter(NuevoCliente);
