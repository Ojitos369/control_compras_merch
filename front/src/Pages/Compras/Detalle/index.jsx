import { useVars, useMyEffects } from "./myUse";
import { TwiceLogo } from "../../../Components/Loaders/TwiceLogo";
import { Acciones } from "./Acciones";
import { Images } from "./Images";
import { Generales } from "./Generales";
import { DetalView } from "./DetalView";
import { Articulos } from "./Articulos";
import { Cargos } from "./Cargos";
import { Abonos } from "./Abonos";

const Detalle = props => {
    const { styles, cargandoCompra, detailView } = useVars();

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
            <Acciones />
            <Images />
            <Generales />
            <DetalView />
            {detailView === 'compra' && <Articulos />}
            {detailView === 'cargos' && <Cargos />}
            {detailView === 'abonos' && <Abonos />}
        </section>
    )
}

export { Detalle };