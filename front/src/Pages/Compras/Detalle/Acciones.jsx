import { useVars } from "./myUse";
import { Piggy, CardPayment, MoneyMouthFace, CheckList, Edit } from "../../../Components/Icons";
import { Link } from "react-router-dom";
const Acciones = props => {
    const { styles, agregarPago, agregarCargo, revisarPagos, editarCompra, compra_id, creadorCompra } = useVars();
    return (
        <div className={`${styles.accionesContainer}`}>
            {creadorCompra && 
            <div className={`${styles.actionDiv}`}>
                <button 
                    data-tooltip-id="global" data-tooltip-content="Agregar Cargo Alt+C"
                    className={`${styles.actionIcon}`}
                    onClick={agregarCargo}>
                    <MoneyMouthFace />
                </button>
            </div>}
            {creadorCompra && 
            <div className={`${styles.actionDiv}`}>
                <button 
                    data-tooltip-id="global" data-tooltip-content="Agregar Pago Alt+P"
                    className={`${styles.actionIcon}`}
                    onClick={agregarPago}>
                    <Piggy />
                </button>
            </div>}
            {!creadorCompra &&
            <div className={`${styles.actionDiv}`}>
                <button 
                    data-tooltip-id="global" data-tooltip-content="Enviar ¨Pago Alt+P"
                    className={`${styles.actionIcon}`}
                    onClick={agregarPago}>
                    <CardPayment />
                </button>
            </div>}
            {creadorCompra && 
            <div className={`${styles.actionDiv}`}>
                <button 
                    data-tooltip-id="global" data-tooltip-content="Revisar Pagos Alt+R"
                    className={`${styles.actionIcon}`}
                    onClick={revisarPagos}>
                    <CheckList />
                </button>
            </div>}
            {creadorCompra && 
            <div className={`${styles.actionDiv}`}>
                <Link 
                    data-tooltip-id="global" data-tooltip-content="Revisar Pagos Alt+E"
                    className={`${styles.actionIcon}`}
                    to={`/compras/editar/${compra_id}`} >
                    <Edit />
                </Link>
            </div>}
        </div>
    )
}

export { Acciones };