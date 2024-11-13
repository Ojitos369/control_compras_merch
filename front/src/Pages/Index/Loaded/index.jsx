import { useEffect } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { Actions } from '../../Index/Loaded/Actions';
import { ItemsList } from '../../Index/Loaded/ItemsList';
import styles from './styles/index.module.scss';

const Loaded = props => {
    const { f } = useStates();

    useEffect(() => {
        f.compras.getMyCompras();
    }, [])
    return (
        <div className={`flex flex-wrap w-full ${styles.mainLoaded}`}>
            <Actions />
            <ItemsList />
        </div>
    )
}

export { Loaded };