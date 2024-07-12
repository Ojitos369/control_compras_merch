import { useVars } from "./myUse";
import { showCurrency, showDate } from "../../../Core/helper";

const Cargos = props => {
    const { 
        styles, cargoView, changeCargoView, 
        cargoListView, cargoTotalView,   } = useVars();

    return (
        <div className={`${styles.cargosContainer}`}>
            <div className={`${styles.cargoViewContainer}`}>
                <button 
                    className={`${styles.cargoViewButton} ${cargoView === 'todo' ? styles.cargoViewButtonActive : ''}`}
                    onClick={() => changeCargoView('todo')}
                >
                    Todo
                </button>
                <button 
                    className={`${styles.cargoViewButton} ${cargoView === 'extra' ? styles.cargoViewButtonActive : ''}`}
                    onClick={() => changeCargoView('extra')}
                >
                    Extra
                </button>
                <button 
                    className={`${styles.cargoViewButton} ${cargoView === 'compra' ? styles.cargoViewButtonActive : ''}`}
                    onClick={() => changeCargoView('compra')}
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
                                    Tipo
                                </th>
                                <th>
                                    Fecha
                                </th>
                                <th>
                                    Fecha Limite
                                </th>
                                <th>
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {cargoListView.map((ele, i) => {
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
    const { fecha_cargo, fecha_limite, tipo, total, usuario } = ele;
    return (
        <tr className={`${styles[par ? 'par' : 'impar']}`}>
            <td>
                { usuario }
            </td>
            <td>
                { tipo }
            </td>
            <td>
                { showDate(fecha_cargo) }
            </td>
            <td>
                { showDate(fecha_limite, false) }
            </td>
            <td>
                { showCurrency(total) }
            </td>
        </tr>
    )
}

export { Cargos };

