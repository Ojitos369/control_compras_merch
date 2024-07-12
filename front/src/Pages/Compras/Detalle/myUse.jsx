import { useEffect, useMemo } from "react";
import { useStates } from "../../../Hooks/useStates";
import { useParams } from "react-router-dom";
import styles from './styles/index.module.scss'

const useVars = props => {
    const { s, f } = useStates();
    const { compra_id } = useParams();

    const { compra={}, usuarios=[], imagenes=[], articulos=[], cargos:cargosGenerales=[], abonos:abonosGenerales=[] } = useMemo(() => s.compras?.consulta?.compraData || {}, [s.compras?.consulta?.compraData]);

    const imgLink = useMemo(() => s.general?.imagesLink || '', [s.general?.imagesLink]);
    const cargandoCompra = useMemo(() => s.loadings?.compras?.getCompra, [s.loadings?.compras?.getCompra]);
    const detailView = useMemo(() => s.compras?.consulta?.detailView || 'compra', [s.compras?.consulta?.detailView]);
    const cargoView = useMemo(() => s.compras?.consulta?.cargoView || 'todo', [s.compras?.consulta?.cargoView]);
    const abonoView = useMemo(() => s.compras?.consulta?.abonoView || 'todo', [s.compras?.consulta?.abonoView]);
    const keys = useMemo(() => s.shortCuts?.keys || {}, [s.shortCuts?.keys]);
    const showAgregarCargo = useMemo(() => s.modals?.compras?.agregarCargo, [s.modals?.compras?.agregarCargo]);
    const showAgregarAbono = useMemo(() => s.modals?.compras?.agregarAbono, [s.modals?.compras?.agregarAbono]);
    const newCargo = useMemo(() => s.compras?.newCargo?.data || {}, [s.compras?.newCargo?.data]);

    const keyExec = useMemo(() => {
        const comprasKeys = Object.keys(s.modals?.compras || {});
        const compras = comprasKeys.some(e => s.modals?.compras[e]);
        const generalKeys = Object.keys(s.modals?.general || {});
        const general = generalKeys.some(e => s.modals?.general[e]);
        return !(compras || general);
    }, [s.modals?.compras, s.modals?.general])

    const { cargosExtra, cargosCompra, cargosExtraTotal, cargosTotal } = useMemo(() => {
        const cargosExtra = cargosGenerales.filter(e => e.tipo !== 'compra');
        const cargosCompra = cargosGenerales.filter(e => e.tipo === 'compra');
        const cargosExtraTotal = cargosExtra.reduce((acc, e) => acc + e.total, 0);
        const cargosTotal = cargosGenerales.reduce((acc, e) => acc + e.total, 0);
        return { cargosExtra, cargosCompra, cargosExtraTotal, cargosTotal };
    }, [cargosGenerales]);

    const [cargoListView, cargoTotalView] = useMemo(() => {
        switch (cargoView) {
            case 'extra':
                return [cargosExtra, cargosExtraTotal];
            case 'compra':
                return [cargosCompra, cargosCompra.reduce((acc, e) => acc + e.total, 0)];
            default:
                return [cargosGenerales, cargosTotal];
        }
    }, [cargoView]);

    const { abonosExtra, abonosCompra, abonosExtraTotal, abonosTotal } = useMemo(() => {
        const abonosExtra = abonosGenerales.filter(e => e.tipo !== 'extra');
        const abonosCompra = abonosGenerales.filter(e => e.tipo === 'compra');
        const abonosExtraTotal = abonosExtra.reduce((acc, e) => acc + e.total, 0);
        const abonosTotal = abonosGenerales.reduce((acc, e) => acc + e.total, 0);
        return { abonosExtra, abonosCompra, abonosExtraTotal, abonosTotal };
    }, [abonosGenerales]);

    const [abonoListView, abonoTotalView] = useMemo(() => {
        switch (abonoView) {
            case 'extra':
                return [abonosExtra, abonosExtraTotal];
            case 'compra':
                return [abonosCompra, abonosCompra.reduce((acc, e) => acc + e.total, 0)];
            default:
                return [abonosGenerales, abonosTotal];
        }
    }, [abonoView]);

    const { actualImage, indexImage, lenImages } = useMemo(() => {
        const actualImage = s.compras?.consulta?.imageSelected || {};
        const indexImage = imagenes.findIndex(e => e.id_imagen === actualImage.id_imagen);
        const lenImages = imagenes.length;
        return { actualImage, indexImage, lenImages };
    }, [s.compras?.consulta?.imageSelected, imagenes]);

    // -----------------------------------------   FUNCTIONS   -----------------------------------------
    const toogleDetailView = mode => {
        f.u2('compras', 'consulta', 'detailView', mode);
    }

    const changeCargoView = mode => {
        f.u2('compras', 'consulta', 'cargoView', mode);
    }

    const changeAbonoView = mode => {
        f.u2('compras', 'consulta', 'abonoView', mode);
    }

    const chageImageSelected = index => {
        let newIndex = index;
        if (newIndex < 0) {
            newIndex = imagenes.length - 1;
        } else if (newIndex >= imagenes.length) {
            newIndex = 0;
        }
        const newImage = imagenes[newIndex];
        const url = `${imgLink}/${newImage?.compra_id}/preview/${newImage?.filename}`;
        f.u2('compras', 'consulta', 'imageSelected', {...newImage, url});
    }

    const closeModals = () => {
        f.u0('modals', null);
    }

    const agregarCargo = e => {
        if (!!e) e.preventDefault();
        f.u2('modals', 'compras', 'agregarCargo', true);
    }
    const agregarAbono = e => {
        if (!!e) e.preventDefault();
        console.log('agregarAbono');
    }

    const validaMK = e => {
        let thisKeys = f.cloneO(keys);
        const actual = e.key.toLowerCase();
        thisKeys[actual] = true;
        const vals = Object.keys(thisKeys);

        if (vals.length != 2) return;
        else if (!!thisKeys.alt && !!thisKeys.a) agregarAbono(e);
        else if (!!thisKeys.alt && !!thisKeys.c) agregarCargo(e);
    }

    const updateNewCargo = (key, value) => {
        f.u3('compras', 'newCargo', 'data', key, value);
    }

    const guardarCargo = e => {
        if (!!e) e.preventDefault();
        console.log('guardarCargo');
    }

    return {
        styles, imgLink, 
        cargandoCompra, 
        compra_id, compra, convertLink: f.general.convertLink, 
        imagenes, articulos, 
        toogleDetailView, detailView,
        cargoView, changeCargoView, 
        cargoListView, cargoTotalView, 
        abonoView, changeAbonoView,
        abonoListView, abonoTotalView,
        actualImage, indexImage, lenImages, chageImageSelected, 
        usuarios, 
        agregarCargo, agregarAbono, 
        showAgregarCargo, showAgregarAbono, 
        newCargo, updateNewCargo, guardarCargo, 
        validaMK, keyExec, closeModals, 
    }
}

const useMyEffects = props => {
    const { f } = useStates();
    const { compra_id, chageImageSelected, imagenes } = useVars();

    useEffect(()  => {
        f.compras.getCompra(compra_id);
    }, [compra_id]);

    useEffect(() => {
        chageImageSelected(0);
    }, [compra_id, imagenes.length]);
}


export { useVars, useMyEffects };