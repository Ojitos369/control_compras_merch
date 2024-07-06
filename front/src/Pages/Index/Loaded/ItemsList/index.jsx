import { useStates } from "../../../../Hooks/useStates";
import { ShowElement } from "./ShowElement";
import styles from './styles/index.module.scss';
const ItemsList = props => {
    const { compras } = props;
    return (
        <div className={`${styles.itemListContainer}`}>
            <div className={`${styles.itemList}`}>
                {compras.map((item, index) => {
                    return (
                        <div key={index} className={`${styles.compra}`}>
                            <ShowElement
                                styles={styles}
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