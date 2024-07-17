import { useVars } from "./myUse";
import { Piggy, CardPayment, MoneyMouthFace, CheckList } from "../../../Components/Icons";
const Acciones = props => {
    const { styles, agregarPago, agregarCargo, revisarPagos, creadorCompra } = useVars();
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
                    data-tooltip-id="global" data-tooltip-content="Agregar Pago Alt+P"
                    className={`${styles.actionIcon}`}
                    onClick={agregarPago}>
                    <Piggy />
                </span>
            </div>}
            {!creadorCompra &&
            <div className={`${styles.actionDiv}`}>
                <span 
                    data-tooltip-id="global" data-tooltip-content="Enviar ¨Pago Alt+P"
                    className={`${styles.actionIcon}`}
                    onClick={agregarPago}>
                    <CardPayment />
                </span>
            </div>}
            {creadorCompra && 
            <div className={`${styles.actionDiv}`}>
                <span 
                    data-tooltip-id="global" data-tooltip-content="Revisar Pagos Alt+R"
                    className={`${styles.actionIcon}`}
                    onClick={revisarPagos}>
                    <CheckList />
                </span>
            </div>}
        </div>
    )
}

export { Acciones };