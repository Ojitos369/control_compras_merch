import { useVars, useMyEffects } from "./myUse";
import { TwiceLogo } from "../../../Components/Loaders/TwiceLogo";
import { Images } from "./Images";
import { Generales } from "./Generales";
import { Articulos } from "./Articulos";
import { Resumen } from "./Resumen";

const Detalle = props => {
    const { styles, cargandoCompra } = useVars();

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
            <Images />
            <Generales />
            <Articulos />
            <Resumen />
        </section>
    )
}

export { Detalle };