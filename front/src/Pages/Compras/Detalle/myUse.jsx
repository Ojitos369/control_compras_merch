import { useEffect, useMemo } from "react";
import { useStates } from "../../../Hooks/useStates";
import { useParams } from "react-router-dom";
import styles from './styles/index.module.scss'

const useVars = props => {
    const { s, f } = useStates();
    const { compra_id } = useParams();
    const { compra={}, imagenes=[], articulos=[], cargos=[], abonos=[] } = useMemo(() => s.compras?.consulta?.compraData || {}, [s.compras?.consulta?.compraData]);
    const cargandoCompra = useMemo(() => s.loadings?.compras?.getCompra, [s.loadings?.compras?.getCompra]);

    return {
        styles, 
        cargandoCompra, 
        compra_id, compra, 
        imagenes, articulos, cargos, abonos, 
    }
}

const useMyEffects = props => {
    const { f } = useStates();
    const { compra_id } = useVars();

    useEffect(()  => {
        f.compras.getCompra(compra_id);
    }, [compra_id])
}

export { useVars, useMyEffects };