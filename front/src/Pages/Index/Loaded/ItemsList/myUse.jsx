import { useMemo } from 'react';
import { useStates } from '../../../../Hooks/useStates';
import styles from './styles/index.module.scss';

const useVars = props => {
    const { s } = useStates();
    const misCompras = useMemo(() => s.compras?.misCompras || [], [s.compras?.misCompras]);
    // console.log('misCompras', misCompras);
    const imgLink = useMemo(() => s.general?.imagesLink || '', [s.general?.imagesLink]);

    return { 
        styles, 
        misCompras, imgLink
    };
}

const useMyEffects = props => {

}

export { useVars, useMyEffects };