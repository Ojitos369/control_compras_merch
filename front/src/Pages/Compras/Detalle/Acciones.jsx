import { useVars } from "./myUse";
import { Piggy, Revenue, MoneyMouthFace } from "../../../Components/Icons";
const Acciones = props => {
    const { styles, agregarAbono, agregarCargo, creadorCompra } = useVars();
    return (
        <div className={`${styles.accionesContainer}`}>
            {creadorCompra && 
            <div className={`${styles.actionDiv}`}>
                <span 
                    data-tooltip-id="global" data-tooltip-content="Agregar Cargo Alt+C"
                    className={`${styles.actionIcon}`}
                    onClick={agregarCargo}>
                    <MoneyMouthFace />
                </span>
            </div>}
            {creadorCompra && 
            <div className={`${styles.actionDiv}`}>
                <span 
                    data-tooltip-id="global" data-tooltip-content="Agregar Abono Alt+A"
                    className={`${styles.actionIcon}`}
                    onClick={agregarAbono}>
                    <Piggy />
                </span>
            </div>}
        </div>
    )
}

export { Acciones };