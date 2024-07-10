import { useVars } from "./myUse";
import { showCurrency, showDate } from "../../../Core/helper";

const Generales = props => {
    const { styles, compra } = useVars();
    // console.log('compra', compra);
    const { descripcion_compra, fecha_compra, link, nombre_compra, origen, fecha_limite, total, total_abonado=0 } = compra;

    return (
        <div className={`${styles.generalesContainer}`}>
            <h2 className={`${styles.nombreCompra}`}>
                {nombre_compra}
            </h2>
            <p className={`${styles.descripcionCompra}`}>
                {descripcion_compra}
            </p>
            <div className={`${styles.fechaContainer}`}>
                <p className={`${styles.fechaCompra}`}>
                    {showDate(fecha_compra)}
                </p>
                <p className={`${styles.fechaLimite}`}>
                    {showDate(fecha_limite, false)}
                </p>
            </div>
            <div className={`${styles.totalContainer}`}>
                <p className={`${styles.total}`}>
                {showCurrency(total_abonado)}/{showCurrency(total)}
                </p>
            </div>
            <a href={link} target='_blank' className={`${styles.origen}`}>
                {origen}
            </a>
        </div>
    )
}

export { Generales };