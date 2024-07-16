import { useVars } from "./myUse";
import { showCurrency } from "../../../Core/helper";

const Articulos = props => {
    const { styles, articulos, ordenar, validarOrdenTable } = useVars();

    const order = mode => {
        ordenar(mode, [...articulos], 'articulos');
    }

    return (
        <div className={`${styles.articulosContainer}`}>

            <div className={`${styles.tableContainer}`}>
                <div className={`${styles.tableDiv}`}>
                    <table className={`${styles.table} table table-auto`}>
                        <thead>
                            <tr>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('usuario');
                                        }}>
                                        Usuario {validarOrdenTable('usuario')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('descripcion');
                                        }}>
                                        Articulo {validarOrdenTable('descripcion')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('cantidad');
                                        }}>
                                        Cantidad {validarOrdenTable('cantidad')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('precio');
                                        }}>
                                        Precio {validarOrdenTable('precio')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('total');
                                        }}>
                                        Total {validarOrdenTable('total')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('total_abonado');
                                        }}>
                                        Abonado {validarOrdenTable('total_abonado')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('restante');
                                        }}>
                                        Pendiente {validarOrdenTable('restante')}
                                    </button>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {articulos.map((ele, i) => {
                                return (<ShowElement
                                    key={i}
                                    ele={ele}
                                    index={i}
                                    styles={styles}
                                />)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const ShowElement = props => {
    const { ele, index, styles } = props;
    const par = index % 2 === 0;
    const { cantidad, descripcion, precio, total, total_abonado, usuario, restante } = ele;
    return (
        <tr className={`${styles[par ? 'par' : 'impar']}`}>
            <td>
                { usuario }
            </td>
            <td>
                { descripcion }
            </td>
            <td>
                { cantidad }
            </td>
            <td>
                { showCurrency(precio) }
            </td>
            <td>
                { showCurrency(total) }
            </td>
            <td>
                { showCurrency(total_abonado) }
            </td>
            <td>
                { showCurrency(restante) }
            </td>
        </tr>
    )
}

export { Articulos };

