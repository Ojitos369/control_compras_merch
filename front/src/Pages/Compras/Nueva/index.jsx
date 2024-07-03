import { useStates } from "../../../Hooks/useStates";
import { useEffect, useMemo } from "react";
import { Images } from "./Images";
import { Generales } from "./Generales";
import { Articulos } from "./Articulos";
import { Resumen } from "./Resumen";
import { ColorsCubesUpdate } from "../../../Components/Loaders/ColorsCubesUpdate";
import styles from './styles/index.module.scss';

const Nueva = props => {
    const { s, f, gs } = useStates();
    const data = useMemo(() => s.compras?.actualCompra?.form || {}, [s.compras?.actualCompra?.form]);
    const guardando = useMemo(() => !s.loadings?.compras?.guardarCompra, [s.loadings?.compras?.guardarCompra]);


    useEffect(() => {
        const id = f.general.getUuid();
        f.u2('compras', 'actualCompra', 'form', {id});
        f.u3('compras', 'actualCompra', 'form', 'images', null);
        f.compras.validarImagenesNoGuardadas();
    }, [])

    if (guardando) {
        return (
            <ColorsCubesUpdate />
        )
    }

    return (
        <section className={`flex flex-row flex-wrap justify-center w-full ${styles.nueva_compra_container} py-4`}>
            <Images s={s} f={f} styles={styles}/>
            <Generales s={s} f={f} gs={gs} styles={styles} data={data}/>
            <Articulos s={s} f={f} gs={gs} styles={styles} data={data.items || []}/>
            <Resumen s={s} f={f} gs={gs} styles={styles} data={data}/>
        </section>
    )
}

export { Nueva };