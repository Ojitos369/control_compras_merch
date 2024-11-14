import { useVars, useMyEffects } from '../myUse';

const SelectCompra = props => {
    const { styles } = useVars();

    return (
        <div className={`${styles.selectCompraContainer}`}>
        </div>
    )
}

export { SelectCompra };