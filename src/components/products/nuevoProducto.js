import React, { Fragment, useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router';

const NuevoProducto = (props) => {

    // producto = state, guardarProducto = setState
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: ''
    });
    // archivo = state
    const [archivo, guardarArchivo] = useState('');

    // almacenar el nuevo producot en la bd
    const agregarProducto = async e => {
        e.preventDefault();

        // crear un formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);
        console.log(formData);

        // almacenarlo
        try {
            const res = await clienteAxios.post('/productos', formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });

            // lanzar alerta
            if(res.status === 200) {
                Swal.fire(
                    'Agregado correctamente',
                    res.data.mensaje,
                    'success'
                )
            }

            // redireccionar 
            props.history.push('/productos')
            
        } catch (error) {
            console.log(error);
            // lanzar alerta
            Swal.file({
                type: 'error',
                title: 'Hubo un error al enviar la solicitud',
                text: 'Vuelva a intentar'
            })
        }
    }

    // leer los datos del formulario
    const leerInfoProducto = e => {
        guardarProducto({
            // obtener copia del state
            ...producto,
            [e.target.name]: [e.target.value]
            
        });

    }

    // colocar la imagen en el state
    const leerArchivo = e => {
        guardarArchivo( e.target.files[0]);
    }



    return ( 
<Fragment>
    <h2>Nuevo Producto</h2>

    <form 
        onSubmit={agregarProducto}
    >
        <legend>Llena todos los campos</legend>

        <div className="campo">
            <label>Nombre:</label>
            <input type="text" placeholder="Nombre Producto" name="nombre" onChange={leerInfoProducto} />
        </div>

        <div className="campo">
            <label>Precio:</label>
            <input type="number" name="precio" min="10000.00" step="5000.00" placeholder="Precio" onChange={leerInfoProducto}/>
        </div>

        <div className="campo">
            <label>Imagen:</label>
            <input type="file"  name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
                <input type="submit" className="btn btn-azul" value="Agregar Producto" />
        </div>
    </form>
</Fragment>
     );
}
 
export default withRouter(NuevoProducto);