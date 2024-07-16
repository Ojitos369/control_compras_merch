import { useVars } from "./myUse";
import { showCurrency, showDate } from "../../../Core/helper";

const Abonos = props => {
    const { 
        styles, abonoView, changeAbonoView, 
        abonoListView, ordenar, validarOrdenTable } = useVars();

    const order = mode => {
        ordenar(mode, [...abonoListView], 'abonos');
    }

    return (
        <div className={`${styles.abonosContainer}`}>
            <div className={`${styles.abonoViewContainer}`}>
                <button 
                    className={`${styles.abonoViewButton} ${abonoView === 'todo' ? styles.abonoViewButtonActive : ''}`}
                    onClick={() => changeAbonoView('todo')}
                >
                    Todo
                </button>
                <button 
                    className={`${styles.abonoViewButton} ${abonoView === 'extra' ? styles.abonoViewButtonActive : ''}`}
                    onClick={() => changeAbonoView('extra')}
                >
                    Extra
                </button>
                <button 
                    className={`${styles.abonoViewButton} ${abonoView === 'compra' ? styles.abonoViewButtonActive : ''}`}
                    onClick={() => changeAbonoView('compra')}
                >
                    Compra
                </button>
            </div>
            
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
                                            order('tipo');
                                        }}>
                                        Tipo {validarOrdenTable('tipo')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('fecha_abono');
                                        }}>
                                        Fecha {validarOrdenTable('fecha_abono')}
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
                            </tr>
                        </thead>

                        <tbody>
                            {abonoListView.map((ele, i) => {
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
    const { cantidad, tipo, fecha_abono, usuario } = ele;
    return (
        <tr className={`${styles[par ? 'par' : 'impar']}`}>
            <td>
                { usuario }
            </td>
            <td>
                { tipo }
            </td>
            <td>
                { showDate(fecha_abono) }
            </td>
            <td>
                { showCurrency(cantidad) }
            </td>
        </tr>
    )
}

export { Abonos };

