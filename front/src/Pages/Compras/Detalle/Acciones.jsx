import { useVars } from "./myUse";
const Acciones = props => {
    const { styles } = useVars();
    return (
        <div className={`${styles.accionesContainer}`}>
            <div className={`${styles.actionDiv}`}>
                <button className={`${styles.actionButton}`}>
                    Agregar Cargo
                </button>
            </div>
            <div className={`${styles.actionDiv}`}>
                <button className={`${styles.actionButton}`}>
                    Agregar Abono
                </button>
            </div>
        </div>
    )
}

export { Acciones };