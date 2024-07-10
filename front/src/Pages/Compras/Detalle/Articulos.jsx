import { useVars } from "./myUse";

const Articulos = props => {
    const { styles } = useVars();
    return (
        <div className={`${styles.articulosContainer}`}>
            Articulos
        </div>
    )
}

export { Articulos };