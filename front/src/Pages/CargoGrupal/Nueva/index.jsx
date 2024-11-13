import { ItemsList } from './ItemsList';
import { useVars, useMyEffects } from './myUse';

const Nueva = props => {
    const { styles } = useVars();
    useMyEffects();

    return (
        <div className={`${styles.nuevoCargoContainer}`}>
            <ItemsList />
        </div>
    )
}

export { Nueva };