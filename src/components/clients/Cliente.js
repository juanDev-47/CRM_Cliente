import React from 'react';
import Swal from 'sweetalert2';
import {Link} from 'react-router-dom';
import clienteAxios from '../../config/axios'
 
const Cliente = ({cliente}) => {

    // extraer los valores
    const { _id, nombre, apellido, empresa, email, telefono} = cliente;

    // eliminar cliente
    const eliminarCliente = idCliente => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: 'no se podra revertir',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.value) {
                    //llamado a axios
                    clienteAxios.delete(`/clientes/${idCliente}`)
                    .then(res => {
                        Swal.fire(
                            'Eliminado!',
                            res.data.mensaje,
                            'success'
                        )
                    });
            }
        })
    }

    return ( 
        <li className="cliente">
                    <div className="info-cliente">
                        <p className="nombre">{nombre} {apellido}</p>
                        <p className="empresa">{empresa}</p>
                        <p>{email}</p>
                        <p>{telefono}</p>
                    </div>
                    <div className="acciones">
                        <Link to={`cliente/editar/${_id}`} className="btn btn-amarillo">
                            <i className="fas fa-pen-alt"/>
                             Editar Cliente
                        </Link>

                        <Link to={`pedidos/nuevo/${_id}`} className="btn btn-azul">
                            <i className="fas fa-plus"/>
                             Editar Producto
                        </Link>

                        <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => eliminarCliente(_id)}>
                            <i className="fas fa-times"/>
                            Eliminar Cliente
                        </button>
                    </div>
                </li>
     );
}
 
export default Cliente;