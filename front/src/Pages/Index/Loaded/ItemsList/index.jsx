import { useVars } from "./myUse";
import { ShowElement } from "./ShowElement";

const ItemsList = props => {
    const { misCompras, styles } = useVars();

    return (
        <div className={`${styles.itemListContainer}`}>
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