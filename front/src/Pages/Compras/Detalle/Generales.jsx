import { useVars } from "./myUse";
import { showCurrency, showDate } from "../../../Core/helper";

const Generales = props => {
    const { styles, 
        compra, pagosExtraTotal, cargosExtraTotal, 
        pagosTotal, cargosTotal, convertLink, usuariosUnicos, 
        filtroUser, actualizarFiltroUser,
        cargosCompraTotal, pagosCompraTotal, 
    } = useVars();
    const { descripcion_compra, fecha_compra, link, nombre_compra, origen, fecha_limite, total, total_abonado=0 } = compra;

    return (
        <div className={`${styles.generalesContainer}`}>
            <h2 className={`${styles.nombreCompra}`}>
                {nombre_compra}
            </h2>
            <p className={`${styles.fechaCompra}`}>
                {showDate(fecha_compra)}
            </p>
            <p className={`${styles.descripcionCompra}`}>
                {descripcion_compra}
            </p>
            <div className={`${styles.origenContainer}`}>
                <p className={`${styles.origenLabel}`}>
                    Origen:
                </p>
                <a href={convertLink(link)} target='_blank' className={`${styles.origen}`}>
                    {origen}
                </a>
            </div>
            <div className={`${styles.limitePago}`}>
                <p className={`${styles.fechaLimiteLabel}`}>
                    Fecha límite de pago:
                </p>
                <p className={`${styles.fechaLimite}`}>
                    {showDate(fecha_limite, false)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Compra:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(pagosCompraTotal)}/{showCurrency(cargosCompraTotal)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Resta Compra:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(cargosCompraTotal-pagosCompraTotal)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Cargos:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(pagosExtraTotal)}/{showCurrency(cargosExtraTotal)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Resta Cargos:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(cargosExtraTotal-pagosExtraTotal)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Total:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(pagosTotal)}/{showCurrency(cargosTotal)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Resta Total:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(cargosTotal-pagosTotal)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Filtrar por:
                </p>
                <select 
                    className="text-black"
                    value={filtroUser} 
                    onChange={e => actualizarFiltroUser(e.target.value)}>
                    <option value="">Todos</option>
                    {usuariosUnicos.map(u => {
                        return (
                            <option 
                                key={u.id_usuario}
                                value={u.id_usuario}>
                                {u.usuario}
                            </option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}

export { Generales };