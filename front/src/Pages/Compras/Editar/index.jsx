import { useStates } from "../../../Hooks/useStates";
import { Images } from "./Images";
import { Generales } from "./Generales";
import { Articulos } from "./Articulos";
import { Resumen } from "./Resumen";
import { useKeyDown, useKeyUp } from "../../../Hooks/myHooks";
import { ColorsCubesUpdate } from "../../../Components/Loaders/ColorsCubesUpdate";
import { useVars, useMyEffects } from "./myUse";
import styles from './styles/index.module.scss';


const ListenKeys = props => {
    const { keyExec } = props;
    // ---------------------------------------------   KEYBOARD EVENTS   --------------------------------------------- #
    useKeyDown(props.validaMK, ['alt', 'a', 'enter'], keyExec);

    useKeyUp(null, ['any'], keyExec);
    // ---------------------------------------------   /KEYBOARD EVENTS   --------------------------------------------- #

    return null;
}

const Editar = props => {
    const { s, f, gs } = useStates();

    const { guardando, keyExec, validaMK } = useVars({ s });

    useMyEffects();

    if (guardando) {
        return (
            <ColorsCubesUpdate />
        )
    }

    return (
        <section className={`flex flex-row flex-wrap justify-center w-full ${styles.nueva_compra_container} py-4`}>
            {keyExec && 
            <ListenKeys 
                keyExec={keyExec}
                validaMK={validaMK}
            />}
            <Images 
                f={f} styles={styles}
            />
            <Generales s={s} f={f} gs={gs} styles={styles}/>
            <Articulos 
                s={s} 
                f={f} 
                gs={gs} 
                styles={styles} />
            <Resumen s={s} f={f} gs={gs} styles={styles}/>
        </section>
    )
}

export { Editar };

