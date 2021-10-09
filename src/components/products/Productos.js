import React, {useEffect, useState, Fragment, useContext} from 'react';
import { Link, withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Producto from './producto';
import Spinner from './../layout/Spinner';

import { CRMContext } from '../../context/CRMContext';

const Productos = (props) => {

    // productos = state
    const [productos, guardarProductos] = useState([]);

    const [auth, guardarAuth] = useContext( CRMContext );

    // useEffect para consutlar la api
    useEffect(() => {
        // query a la api
        if(auth.token !== '') {
            const consultarApi = async () => {
                try {
                    const productosConsulta = await clienteAxios.get('/productos', {
                        headers: {
                          Authorization: `Bearer ${auth.token}`,
                        }
                      });
                    
                    guardarProductos(productosConsulta.data);
                } catch (error) {
                    props.history.push('/Login')
                }
            }
    
            // llamando la api
            consultarApi();
        } else {
            props.history.push('/Login')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[productos]);

    if(!auth.auth) {
        props.history.push('/Login')
    }

    // spinner de carga
        if(!productos.length) return <Spinner/>

    return ( 
        <Fragment>
            <h2>Productos</h2>

            <Link to={'/productos/nuevos'} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                {productos.map(producto => (
                    <Producto 
                        key={producto._id}
                        producto={producto}
                    />
                ))}        
            </ul>

        </Fragment>
     );
}
 
export default withRouter(Productos);
