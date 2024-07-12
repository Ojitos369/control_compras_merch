import { useVars } from "./myUse";
import { showCurrency, showDate } from "../../../Core/helper";

const Generales = props => {
    const { styles, compra, abonosExtraTotal, cargosExtraTotal, abonosTotal, cargosTotal, convertLink } = useVars();
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
                    {showCurrency(total_abonado)}/{showCurrency(total)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Cargos:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(abonosExtraTotal)}/{showCurrency(cargosExtraTotal)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.totalLabel}`}>
                    Total:
                </p>
                <p className={`${styles.total}`}>
                    {showCurrency(abonosTotal)}/{showCurrency(cargosTotal)}
                </p>
            </div>
        </div>
    )
}

export { Generales };