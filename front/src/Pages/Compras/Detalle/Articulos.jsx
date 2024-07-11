import { useVars } from "./myUse";
import { showCurrency } from "../../../Core/helper";

const Articulos = props => {
    const { styles, articulos } = useVars();

    return (
        <div className={`${styles.articulosContainer}`}>

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

export { Articulos };

