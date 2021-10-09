import React, { Fragment, useState, useEffect } from "react";
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import clienteAxios from '../../config/axios'

const EditarCliente = (props) => {

    // obtener el id
    const { id } = props.match.params;

    // cliente = state, guardarcliente = funcion para guardar el state
  const [cliente, datosCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  // Query a la api
  const consultarApi = async () => {
      const clienteConsulta = await clienteAxios.get(`/clientes/${id}`);

      // colocar en el state
      datosCliente(clienteConsulta.data);

  }

  // useEfect, cuando el componente carga
  useEffect(() => {
    consultarApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[]);

  // leer los datos del formulario
  const actualizarState = e => {
      // almacenar lo que el usuario escribe en le state
      datosCliente({
        // obtener una copia del state actual
        ...cliente, 
        [e.target.name] : e.target.value
      });

  }
  
  // actualizar el cliente mediante axios
  const actualizarCliente = (e) => {
    e.preventDefault();

    // enviar peticion por axios
    clienteAxios.put(`/clientes/${cliente._id}`, cliente)
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
                'Correcto',
                'Se ha actualizado exitosamente!',
                'success'
            )            
            props.history.push('/');
        }
        // redireccionar

    })
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

  return (
    <Fragment>
      <h2>Editar Cliente</h2>
      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState} value={cliente.nombre} />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState} value={cliente.apellido} />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState} value={cliente.empresa} />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState} value={cliente.email} />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input type="tel" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState} value={cliente.telefono} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar cambios"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </Fragment>
  );
};

// HOC, es una funcion que toma un componente y retorna un nuevo componente
export default withRouter(EditarCliente);
