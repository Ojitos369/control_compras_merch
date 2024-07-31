import { useVars, useMyEffects } from "./myUse";
import { useKeyDown, useKeyUp } from "../../../Hooks/myHooks";
import { TwiceLogo } from "../../../Components/Loaders/TwiceLogo";
import { Acciones } from "./Acciones";
import { Images } from "./Images";
import { Generales } from "./Generales";
import { DetalView } from "./DetalView";
import { Articulos } from "./Articulos";
import { Cargos } from "./Cargos";
import { Pagos } from "./Pagos";
import { AgregarCargoModal } from "./Modals/AgregarCargoModal";
import { AgregarPagoModal } from "./Modals/AgregarPagoModal";
import { RevisarPagosModal } from "./Modals/RevisarPagosModal";

const Detalle = props => {
    const { styles, cargandoCompra, detailView, keyExec, showAgregarCargo, showAgregarPago, showRevisarPagos } = useVars();

    useMyEffects();

    if (cargandoCompra) {
        return (
            <section className="flex w-full justify-center mt-[20%]">
                <TwiceLogo className='w-1/2' />
            </section>
        )
    }
    return (
        <section className={`${styles.compraDetailContainer}`}>
            {keyExec && <ListenKeys />}
            <Acciones />
            <Images />
            <Generales />
            <DetalView />
            {detailView === 'compra' && <Articulos />}
            {detailView === 'cargos' && <Cargos />}
            {detailView === 'pagos' && <Pagos />}
            {showAgregarCargo && <AgregarCargoModal />}
            {showAgregarPago && <AgregarPagoModal />}
            {showRevisarPagos && <RevisarPagosModal />}
        </section>
    )
}

const ListenKeys = props => {
    const { keyExec, validaMK } = useVars();
    // ---------------------------------------------   KEYBOARD EVENTS   --------------------------------------------- #
    useKeyDown(validaMK, ['alt', 'c', 'e', 'p', 'v'], keyExec);

    useKeyUp(null, ['any'], keyExec);
    // ---------------------------------------------   /KEYBOARD EVENTS   --------------------------------------------- #

    return null;
}

export { Detalle };