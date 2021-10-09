import React, {Fragment} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

function DetallesPedido({pedido}) {

    const { cliente, total } = pedido;

    const eliminarPedido = id => {
      Swal.fire({
          title: '¿Estas seguro?',
          text: "Luego no hay vuelta atrás",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, elimínalo!'
        }).then((result) => {
          if (result.value) {

              // llamado a axios
              clienteAxios.delete(`/pedidos/${id}`)
              .then(res => {
                  Swal.fire(
                  'Eliminado!',
                  'El cliente se ha eliminado.',
                  'success'
                  )
              })
          }
        })
  }

    return(
        <Fragment>
            <li className="pedido">
          <div className="info-pedido">
            <p className="nombre">Cliente: {cliente.nombre} {cliente.apellido}</p>
            <p className="id">Email: {cliente.email}</p>
            <p className="nombre">Telefono: {cliente.telefono}</p>

            <div className="articulos-pedido">
              <p className="productos">Artículos Pedido: </p>
              <ul>
                {pedido.pedido.map(articulos => (
                    <li key={pedido._id+articulos.producto._id}>
                        <p>{articulos.producto.nombre}</p>
                        <p>Precio: ${articulos.producto.precio}</p>
                        <p>Cantidad: {articulos.cantidad}</p>
                    </li>
                ))}
              </ul>
            </div>
            <p className="total">Total: ${total} </p>
          </div>
          <div className="acciones">
            
            <button type="button" className="btn btn-rojo btn-eliminar"
              onClick={() => eliminarPedido(pedido._id)}
              
            >
              <i className="fas fa-times"></i>
              Eliminar Pedido
            </button>
          </div>
        </li>
        </Fragment>
    )
}

export default DetallesPedido;