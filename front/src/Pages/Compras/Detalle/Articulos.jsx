import { useVars } from "./myUse";

const Articulos = props => {
    const { styles, articulos } = useVars();
    // console.log('articulos', articulos);
    return (
        <div className={`${styles.articulosContainer}`}>
            Articulos
        </div>
    )
}

export { Articulos };