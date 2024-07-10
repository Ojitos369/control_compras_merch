import { useVars } from "./myUse";

const Resumen = props => {
    const { styles } = useVars();
    return (
        <div className={`${styles.resumenContainer}`}>
            Resumen
        </div>
    )
}

export { Resumen };