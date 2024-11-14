import { useMemo, useEffect } from 'react';
import { useStates } from '../../../Hooks/useStates';
import styles from './styles/index.module.scss';

const useVars = props => {
    const { s, f } = useStates();
    const camposForm = [
        {key: 'total', label: 'Total', type: 'number'},
        {key: 'fecha_limite', label: 'Fecha Limite', type: 'date'},
        {key: 'tipo', label: 'Tipo de Cargo', type: 'text'},
    ];


    const formGasto = useMemo(() => s.gastosGrupal?.form || {}, [s.gastosGrupal?.form]);
    const comprasSelected = useMemo(() => s.gastosGrupal?.comprasSelected || [], [s.gastosGrupal?.comprasSelected]);
    const comprasSelectedDetails = useMemo(() => {
        const misCompras = s.gastosGrupal?.misCompras || [];
        let compras = misCompras.filter(c => {
            let { id_compra } = c;
            return comprasSelected.includes(id_compra);
        })
        return compras;
    }, [s.gastosGrupal?.misCompras, comprasSelected]);


    const updateForm = (key, value) => {
        f.u2('gastosGrupal', 'form', key, value);
    };

    return {
        styles,
        formGasto, updateForm, camposForm,
        comprasSelectedDetails
    };
}

const useMyEffects = props => {
    const { f } = useStates();

    useEffect(() => {
        f.u1('gastosGrupal', 'form', null, {});
    }, [])
}

export { useVars, useMyEffects };

