import { useMemo, useEffect } from 'react';
import { useStates } from '../../../../Hooks/useStates';
import styles from './styles/index.module.scss';

const useVars = props => {
    const { s, f } = useStates();
    const filtroCompras = useMemo(() => s.compras?.filtros?.q, [s.compras?.filtros?.q]);
    const misCompras = useMemo(() => {
        const misCompras = s.compras?.misCompras || [];
        if (!filtroCompras) return misCompras;
        let compras = misCompras.filter(c => {
            let { id_compra, nombre_compra, descripcion_compra } = c;
            return [nombre_compra.toUpperCase(), descripcion_compra.toUpperCase()].some(e => e.includes(filtroCompras.toUpperCase())) || id_compra.toUpperCase() === filtroCompras.toUpperCase();
        })
        return compras;
    }, [s.compras?.misCompras, filtroCompras]);
    // console.log('misCompras', misCompras);
    const imgLink = useMemo(() => s.general?.imagesLink || '', [s.general?.imagesLink]);

    const updateFiltro = value => {
        f.u2('compras', 'filtros', 'q', value);
    }

    return { 
        styles, convertLink: f.general.convertLink, 
        misCompras, imgLink, 
        filtroCompras, updateFiltro
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