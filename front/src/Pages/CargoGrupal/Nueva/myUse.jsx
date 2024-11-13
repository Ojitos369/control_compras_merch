import { useMemo, useEffect } from 'react';
import { useStates } from '../../../Hooks/useStates';
import styles from './styles/index.module.scss';

const useVars = props => {
    const { s, f } = useStates();

    return { 
        styles
    };
}

const useMyEffects = props => {
    const { f } = useStates();
    useEffect(() => {
        f.gastosGrupal.getMyCompras();
    }, [])
}

export { useVars, useMyEffects };