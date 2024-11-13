import { useVars, useMyEffects } from "./myUse";
import { ShowElement } from "./ShowElement";
import { Filtro } from "./Filtro";

const ItemsList = props => {
    const { misCompras, styles } = useVars();
    useMyEffects();

    return (
        <div className={`${styles.itemListContainer}`}>
            <Filtro />
            <div className={`${styles.itemList}`}>
                {misCompras.map((item, index) => {
                    return (
                        <div key={index} className={`${styles.compra}`}>
                            <ShowElement
                                element={item}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { ItemsList };