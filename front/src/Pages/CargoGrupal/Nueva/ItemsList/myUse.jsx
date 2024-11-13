import { useMemo, useEffect } from 'react';
import { useStates } from '../../../../Hooks/useStates';
import styles from './styles/index.module.scss';

const useVars = props => {
    const { s, f } = useStates();
    const imgLink = useMemo(() => s.general?.imagesLink || '', [s.general?.imagesLink]);
    const filtroCompras = useMemo(() => s.gastosGrupal?.filtros?.q, [s.gastosGrupal?.filtros?.q]);
    const misCompras = useMemo(() => {
        const misCompras = s.gastosGrupal?.misCompras || [];
        if (!filtroCompras) return misCompras;
        let compras = misCompras.filter(c => {
            let { id_compra, nombre_compra, descripcion_compra } = c;
            return [nombre_compra.toUpperCase(), descripcion_compra.toUpperCase()].some(e => e.includes(filtroCompras.toUpperCase())) || id_compra.toUpperCase() === filtroCompras.toUpperCase();
        })
        return compras;
    }, [s.gastosGrupal?.misCompras, filtroCompras]);
    const comprasSelected = useMemo(() => s.gastosGrupal?.comprasSelected || [], [s.gastosGrupal?.comprasSelected]);

    const updateFiltro = value => {
        f.u2('gastosGrupal', 'filtros', 'q', value);
    }
    const toggleSelected = id_compra => {
        if (comprasSelected.includes(id_compra)) {
            f.u1('gastosGrupal', 'comprasSelected', comprasSelected.filter(e => e !== id_compra));
        }
        else {
            f.u1('gastosGrupal', 'comprasSelected', [...comprasSelected, id_compra]);
        }
    }

    return { 
        styles, convertLink: f.general.convertLink, 
        misCompras, imgLink, 
        filtroCompras, updateFiltro,
        comprasSelected, toggleSelected
    };
}

const useMyEffects = props => {
    useEffect(() => {
        const element = document.getElementById('filterCompra');
        if (element) {
            element.focus();
        }
    }, [])
}

export { useVars, useMyEffects };