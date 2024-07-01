import { useStates } from "../../../Hooks/useStates";
import { useEffect, useMemo } from "react";
import { Images } from "./Images";
import { Generales } from "./Generales";
import { Articulos } from "./Articulos";
import styles from './styles/index.module.scss';

const Nueva = props => {
    const { s, f, gs } = useStates();
    const data = useMemo(() => s.compras?.actualCompra?.form || {}, [s.compras?.actualCompra?.form]);
    const formValid = useMemo(() => {
        const required = ['nombre_compra'];
        return required.every(item => !!data[item]) && !!data.items?.length;
    }, [s.compras?.actualCompra?.form]);


    useEffect(() => {
        const id = f.general.getUuid();
        f.u2('compras', 'actualCompra', 'form', {id});
        f.u3('compras', 'actualCompra', 'form', 'images', null);
        f.compras.validarImagenesNoGuardadas();
    }, [])

    return (
        <section className={`flex flex-row flex-wrap justify-center w-full ${styles.nueva_compra_container} py-4`}>
            <Images s={s} f={f} styles={styles}/>
            <Generales s={s} f={f} gs={gs} styles={styles} data={data}/>
            <Articulos s={s} f={f} gs={gs} styles={styles} data={data.items || [{}]}/>
        </section>
    )
}

export { Nueva };