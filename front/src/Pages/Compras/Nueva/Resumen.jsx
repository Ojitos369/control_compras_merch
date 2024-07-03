import { useMemo, useEffect } from "react";
import { showCurrency } from "../../../Core/helper";


const Resumen = props => {
    const { s, f, styles, gs, data } = props;
    const items = useMemo(() => data.items || [], [data]);

    const valid = useMemo(() => {
        const items = data.items || [];
        const items_valid_fields = items.every(item => !!item.cantidad && !!item.precio && !!item.descripcion_compra);
        const items_valid_length = items.length > 0;
        const valid_name = !!data.nombre_compra;
        return items_valid_fields && items_valid_length && valid_name;
    }, [data.items, data.nombre_compra]);

    const totalItems = useMemo(() => {
        return items.reduce((acc, item) => {
            return acc + parseFloat(item.cantidad || 0);
        }, 0);
    }, [data.items]);
    const total = useMemo(() => data.total, [data.total]);

    const save = e => {
        if (!!e) e.preventDefault();
        if (valid) {
            f.compras.guardarCompra();
        }
    }

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
                <button className={`${styles.button} ${valid ? styles.guardar : styles.guardar_disabled}`}>
                    Guardar
                </button>
            </div>
        </div>
    )
}

export { Resumen };