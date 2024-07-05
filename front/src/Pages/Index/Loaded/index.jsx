import { useEffect, useMemo } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { Actions } from './Actions';
import styles from './styles/index.module.scss';

const Loaded = props => {
    const { f, s } = useStates();
    const misCompras = useMemo(() => s.compras?.misCompras || [], [s.compras?.misCompras]);
    console.log(misCompras);

    useEffect(() => {
        f.compras.getMyCompras();
    }, [])
    return (
        <div className={`flex flex-wrap w-full ${styles.mainLoaded}`}>
            <Actions />
        </div>
    )
}

export { Loaded };