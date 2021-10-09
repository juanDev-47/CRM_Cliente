import React, { Fragment, useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from 'react-router-dom';

import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";

function NuevoPedido(props) {
  const { id } = props.match.params;

  // state
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState('');
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);


  useEffect(() => {
    // obtener el cliente
    const consultarAPI = async () => {
      // consultar el cliente actual
      const res = await clienteAxios.get(`/clientes/${id}`);

      guardarCliente(res.data);
    };

    // llamar la api
    consultarAPI();

    // actualizar el total
    actualizartotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos]);


  const buscarProducto = async e => {
    e.preventDefault();

    // obtener los productos de la busqueda
    const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);
    
    // si no hay resultados una alerta, contrario agregar
    if(resultadoBusqueda.data[0]){

        let productoResultado = resultadoBusqueda.data[0];
        // agregar la llave 
        productoResultado.producto = resultadoBusqueda.data[0]._id;
        productoResultado.cantidad = 0;

        // ponerlo en el state
        guardarProductos([...productos, productoResultado]);
        
    } else {
        Swal.fire({
            type: 'error',
            title: 'Sin resultados',
            text: 'No hubo resultados'
        })
    }

    
  }

  // almacenar una busqueda en el state
  const leerDatosBusqueda = e => {
    guardarBusqueda(e.target.value);
  }

  // actualizar la cantidad de productos
  const restarProductos = i => {
    // copiar el arreglo ariginal
    const todosProductos = [...productos];

    // validar si esta en cero no puede pedir menos
    if(todosProductos[i].cantidad === 0) return;

    // decremento 
    todosProductos[i].cantidad--;

    // almacenarlo
    guardarProductos(todosProductos);
    
  }

  const aumentarProductos = i => {
    // copiar el arreglo
    const todosProductos = [...productos];

    // incremento
    todosProductos[i].cantidad++;

    // almacenarlo
    guardarProductos(todosProductos);
    
  }

  // elimina un producot del state
  const eliminarProductoPedido = id => {
    const todosProductos = productos.filter(producto =>  producto.producto !== id);

    guardarProductos(todosProductos);
  }

  // actualizar el total
  const actualizartotal = () => {
    // si el arreglo de productos es igual 0: el total es 0
    if (productos.length === 0) {
      guardarTotal(0);
      return;
    }

    // calcular el nuevo total
    let nuevototal = 0;

    // reocrrer todos los productos y las cantidades y precios
    productos.map(producto => nuevototal += (producto.precio * producto.cantidad));

    // almacenar en el state
    guardarTotal(nuevototal);
  }


  // almacenar el pedido en la bd
  const realizarPedido = async e => {
    e.preventDefault();

    // extraer el ID
    const { id } = props.match.params;

    // construir el objeto
    const pedido = {
      "cliente": id,
      "pedido": productos,
      "total": total,
    }

    // almacenarlo 
    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

    // leer resultado
    if(resultado.status === 200) {
      Swal.fire({
        type: 'success',
        title: 'Correcto',
        text: 'se almaceno el pedido correctamente'
      })
    } else {
      // alerta de error
      Swal.fire({
        type: 'error',
        title: 'Error al almacenar',
        text: resultado.data.mensaje,
      }) 
    }

    // redireccionar
    props.history.push('/pedidos')

  }


  return (
    <Fragment>
      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          Nombre: {cliente.nombre} {cliente.apellido}
        </p>
        <p>Telefono: {cliente.telefono}</p>
      </div>

      <FormBuscarProducto 
        leerDatosBusqueda = {leerDatosBusqueda}
        buscarProducto = {buscarProducto}
      />

      <ul className="resumen">
        {productos.map((producto, index) => (
            <FormCantidadProducto 
                key={producto.producto}
                producto={producto}
                aumentarProductos={aumentarProductos}
                restarProductos={restarProductos}
                index={index}
                eliminarProductoPedido={eliminarProductoPedido}
            />
        ))}

      </ul>
       
       <p className="total">Total a pagar: <span>$ {total}</span> </p>


       {total > 0 ? (
         <form 
          onSubmit={realizarPedido}
         >
           <input type="submit" className="btn btn-verde btn-block" value="Realizar pedido" />
         </form>
       ) : null }
    </Fragment>
  );
}

export default withRouter(NuevoPedido);
