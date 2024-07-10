import { useMemo, useEffect } from "react";
import { showCurrency } from "../../../Core/helper";


const Resumen = props => {
    const { f, styles, data, save, valid } = props;
    const items = useMemo(() => data.items || [], [data]);

    const totalItems = useMemo(() => {
        return items.reduce((acc, item) => {
            return acc + parseFloat(item.cantidad || 0);
        }, 0);
    }, [data.items]);
    const total = useMemo(() => data.total, [data.total]);

    useEffect(() => {
        const total = items.reduce((acc, item) => {
            return acc + (parseFloat(item.cantidad || 0) * parseFloat(item.precio || 0));
        }, 0);
        f.u3('compras', 'actualCompra', 'form', 'total', total);

    }, [data.items]);

    return (
        <div className={`${styles.resumen}`}>
            <p>
                <span className='font-bold'>Total de items:</span> {totalItems}
            </p>
            <p>
                <span className='font-bold'>Total:</span> {showCurrency(total)}
            </p>
            <div>
                <button 
                    className={`${styles.button} ${valid ? styles.guardar : styles.guardar_disabled}`}
                    onClick={save}
                    >
                    Guardar
                </button>
            </div>
        </div>
    )
}

export { Resumen };