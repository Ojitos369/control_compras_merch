import { showCurrency } from "../../../Core/helper";
import { useVars } from "./myUse";

const Resumen = props => {
    const { f, styles } = props;
    const { save, valid, total, totalItems } = useVars(props);

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
                    data-tooltip-id={`${valid && 'global'}`}
                    data-tooltip-content={`${valid && 'Guardar Alt+Enter'}`}
                    onClick={save}
                    >
                    Guardar
                </button>
            </div>
        </div>
    )
}

export { Resumen };