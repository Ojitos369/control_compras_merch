import { useVars } from "./myUse";
import { showCurrency } from "../../../Core/helper";

const Abonos = props => {
    const { 
        styles, toogleDetailView, abonoView, changeAbonoView, 
        abonoListView, abonoTotalView, 
        abonosGenerales, abonosExtra, abonosCompra, abonosExtraTotal, abonosTotal, 
    } = useVars();

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
                                <th>
                                    Usuario
                                </th>
                                <th>
                                    Articulo
                                </th>
                                <th>
                                    Cantidad
                                </th>
                                <th>
                                    Precio
                                </th>
                                <th>
                                    Total
                                </th>
                                <th>
                                    Abonado
                                </th>
                                <th>
                                    Pendiente
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
    const { cantidad, descripcion, precio, total, total_abonado, usuario } = ele;
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
                { showCurrency(total - total_abonado) }
            </td>
        </tr>
    )
}

export { Abonos };

