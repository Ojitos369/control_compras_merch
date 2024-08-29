import { useEffect, useMemo } from "react";
import { useStates } from "../../../Hooks/useStates";
import { useParams, useNavigate } from "react-router-dom";
import { sortList } from "../../../Core/helper";
import styles from './styles/index.module.scss'

const useVars = props => {
    const { s, f } = useStates();
    const { compra_id } = useParams();
    const navigate = useNavigate();

    const filtroUser = useMemo(() => s.compras?.consulta?.filtroUser || '', [s.compras?.consulta?.filtroUser]);

    const { compra, usuarios, imagenes, articulos, cargos:cargosGenerales, pagos:pagosGenerales, pagos_pendientes } = useMemo(() => {
        const c = s.compras?.consulta?.compraData || {};
        let compra = c.compra || {};
        let usuarios = c.usuarios || [];
        let imagenes = c.imagenes || [];
        let articulos = c.articulos || [];
        let cargos = c.cargos || [];
        let pagos = c.pagos || [];
        let pagos_pendientes = c.pagos_pendientes || [];

        if (!!filtroUser) {pagos
            articulos = articulos.filter(art => art.usuario_id === filtroUser);
            usuarios = usuarios.filter(u => u.id_usuario === filtroUser);
            cargos = cargos.filter(cg => cg.usuario_id === filtroUser);
            pagos = pagos.filter(pg => pg.usuario_id === filtroUser);
            pagos_pendientes = pagos_pendientes.filter(pgp => pgp.usuario_id === filtroUser);

            const total_porcentajes = usuarios.reduce((acc, e) => acc + e.porcentaje, 0)
            usuarios = usuarios.map(u => {
                return {
                    ...u,
                    porcentaje: ((u.porcentaje*100) / total_porcentajes).toFixed(2)
                }
            });
        }
        // console.log('pagos', pagos);
        return {
            compra, usuarios, imagenes, articulos, cargos, pagos, pagos_pendientes
        }

    }, [s.compras?.consulta?.compraData, filtroUser]);

    const usuariosUnicos = useMemo(() => {
        let users = [];
        let added = [];
        (s.compras?.consulta?.compraData?.usuarios || []).forEach(u => {
            if (!added.includes(u.id_usuario)) {
                users.push({
                    id_usuario: u.id_usuario,
                    usuario: u.usuario,
                })
                added.push(u.id_usuario);
            }
        });
        return users;
    }, [s.compras?.consulta?.compraData?.usuarios]);

    const imgLink = useMemo(() => s.general?.imagesLink || '', [s.general?.imagesLink]);
    const cargandoCompra = useMemo(() => s.loadings?.compras?.getCompra, [s.loadings?.compras?.getCompra]);
    const detailView = useMemo(() => s.compras?.consulta?.detailView || 'compra', [s.compras?.consulta?.detailView]);
    const cargoView = useMemo(() => s.compras?.consulta?.cargoView || 'todo', [s.compras?.consulta?.cargoView]);
    const pagoView = useMemo(() => s.compras?.consulta?.pagoView || 'todo', [s.compras?.consulta?.pagoView]);
    const keys = useMemo(() => s.shortCuts?.keys || {}, [s.shortCuts?.keys]);
    const showAgregarCargo = useMemo(() => s.modals?.compras?.agregarCargo, [s.modals?.compras?.agregarCargo]);
    const showAgregarPago = useMemo(() => s.modals?.compras?.agregarPago, [s.modals?.compras?.agregarPago]);
    const showRevisarPagos = useMemo(() => s.modals?.compras?.revisarPagos, [s.modals?.compras?.revisarPagos]);
    const newCargo = useMemo(() => s.compras?.newCargo?.data || {}, [s.compras?.newCargo?.data]);
    const newPago = useMemo(() => s.compras?.newPago?.data || {}, [s.compras?.newPago?.data]);
    const creadorCompra = useMemo(() => compra.creado_por === s.login?.data?.user?.id_usuario, [compra.creado_por, s.login?.data?.user?.id_usuario]);
    const guardandoCargo = useMemo(() => s.loadings?.compras?.guardarCargo, [s.loadings?.compras?.guardarCargo]);
    const guardandoPago = useMemo(() => s.loadings?.compras?.guardarPago, [s.loadings?.compras?.guardarPago]);

    const keyExec = useMemo(() => {
        const comprasKeys = Object.keys(s.modals?.compras || {});
        const compras = comprasKeys.some(e => s.modals?.compras[e]);
        const generalKeys = Object.keys(s.modals?.general || {});
        const general = generalKeys.some(e => s.modals?.general[e]);
        return !(compras || general);
    }, [s.modals?.compras, s.modals?.general])

    const { cargosExtra, cargosCompra, cargosExtraTotal, cargosTotal, cargosCompraTotal } = useMemo(() => {
        const cargosExtra = cargosGenerales.filter(e => e.tipo !== 'compra');
        const cargosCompra = cargosGenerales.filter(e => e.tipo === 'compra');
        const cargosExtraTotal = cargosExtra.reduce((acc, e) => acc + e.total, 0);
        const cargosTotal = cargosGenerales.reduce((acc, e) => acc + e.total, 0);
        const cargosCompraTotal = cargosCompra.reduce((acc, e) => acc + e.total, 0);
        return { cargosExtra, cargosCompra, cargosExtraTotal, cargosTotal, cargosCompraTotal };
    }, [cargosGenerales]);

    const totalNewCargoFinal = useMemo(() => {
        const perUser = newCargo.perUser ?? {};
        const total = newCargo.total ?? 0;
        let totalFinal = 0;
        usuarios.map(usuario => {
            const cantidad = (total || perUser[usuario.compra_det_id]) ? (perUser[usuario.compra_det_id] ?? Number(usuario.porcentaje * total / 100)) : 0;
            totalFinal += Number(cantidad);
        });
        return totalFinal;
    }, [newCargo.total, newCargo.perUser, usuarios]);

    const [cargoListView, cargoTotalView] = useMemo(() => {
        switch (cargoView) {
            case 'extra':
                return [cargosExtra, cargosExtraTotal];
            case 'compra':
                return [cargosCompra, cargosCompra.reduce((acc, e) => acc + e.total, 0)];
            default:
                return [cargosGenerales, cargosTotal];
        }
    }, [cargoView, cargosGenerales]);

    const { pagosExtra, pagosCompra, pagosExtraTotal, pagosTotal, pagosCompraTotal } = useMemo(() => {
        const pagosExtra = pagosGenerales.filter(e => e.tipo !== 'compra');
        const pagosCompra = pagosGenerales.filter(e => e.tipo === 'compra');
        const pagosExtraTotal = (pagosExtra.filter(p => p.validado)).reduce((acc, e) => acc + e.cantidad, 0);
        const pagosTotal = (pagosGenerales.filter(p => p.validado)).reduce((acc, e) => acc + e.cantidad, 0);
        const pagosCompraTotal = pagosCompra.reduce((acc, e) => acc + e.cantidad, 0);
        return { pagosExtra, pagosCompra, pagosExtraTotal, pagosTotal, pagosCompraTotal };
    }, [pagosGenerales]);

    const totalNewPagoFinal = useMemo(() => {
        const perUser = newPago.perUser ?? {};
        const total = newPago.total ?? 0;
        let totalFinal = 0;
        usuarios.map(usuario => {
            const cantidad = (total || perUser[usuario.compra_det_id]) ? (perUser[usuario.compra_det_id] ?? Number(usuario.porcentaje * total / 100)) : 0;
            totalFinal += Number(cantidad);
        });
        return totalFinal;
    }, [newPago.total, newPago.perUser, usuarios]);

    const [pagoListView, pagoTotalView] = useMemo(() => {
        switch (pagoView) {
            case 'extra':
                return [pagosExtra, pagosExtraTotal];
            case 'compra':
                return [pagosCompra, pagosCompra.reduce((acc, e) => acc + e.total, 0)];
            default:
                return [pagosGenerales, pagosTotal];
        }
    }, [pagoView, pagosGenerales]);

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

    const changePagoView = mode => {
        f.u2('compras', 'consulta', 'pagoView', mode);
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
        if (!creadorCompra) return;
        f.u2('modals', 'compras', 'agregarCargo', true);
    }
    const agregarPago = e => {
        if (!!e) e.preventDefault();
        // if (!creadorCompra) return;
        f.u2('modals', 'compras', 'agregarPago', true);
    }

    const updateNewCargo = (key, value) => {
        f.u3('compras', 'newCargo', 'data', key, value);
    }

    const upgradePerUserCargo = (id, value) => {
        f.u4('compras', 'newCargo', 'data', 'perUser', id, value);
    };

    const guardarCargo = e => {
        if (!!e) e.preventDefault();
        if (!creadorCompra) return;
        f.compras.guardarCargo(compra_id, usuarios, creadorCompra);
    }

    const updateNewPago = (key, value) => {
        f.u3('compras', 'newPago', 'data', key, value);
    }

    const upgradePerUserPago = (id, value) => {
        f.u4('compras', 'newPago', 'data', 'perUser', id, value);
    };

    const guardarPago = e => {
        if (!!e) e.preventDefault();
        // if (!creadorCompra) return;
        f.compras.guardarPago(compra_id, usuarios, creadorCompra);
    }

    const revisarPagos = e => {
        if (!!e) e.preventDefault();
        if (!creadorCompra) return;
        f.u2('modals', 'compras', 'revisarPagos', true);
    }

    const validarPago = pago => {
        if (!creadorCompra) return;
        f.compras.validarPago(pago);
    }

    const ordenar = (modo, l, mode) => {
        let order = 'desc';
        if (modo === s.tables?.orden?.mode) {
            order = s.tables?.orden?.order === 'desc' ? 'asc' : 'desc';
        } else {
            order = 'desc';
        }
        l = sortList(l, modo, order);

        switch (mode) {
            case 'articulos':
                f.u3('compras', 'consulta', 'compraData', 'articulos', l);
                break;
            case 'cargos':
                f.u3('compras', 'consulta', 'compraData', 'cargos', l);
                break;
            case 'pagos':
                f.u3('compras', 'consulta', 'compraData', 'pagos', l);
                break;
            default:
                break
        }

        f.u2('tables', 'orden', 'mode', modo);
        f.u2('tables', 'orden', 'order', order);
    }

    const actualizarFiltroUser = user => {
        // s.compras?.consulta?.filtroUser
        f.u2('compras', 'consulta', 'filtroUser', user);
    }

    const editarCompra = e => {
        if (!!e) e.preventDefault();
        if (!creadorCompra) return;
        navigate(`/compras/editar/${compra_id}`);
    }

    const eliminarCompra = e => {
        if (!!e) e.preventDefault();
        if (!creadorCompra) return;
        f.compras.eliminarCompra(compra_id);
    }

    const validaMK = e => {
        let thisKeys = f.cloneO(keys);
        const actual = e.key.toLowerCase();
        thisKeys[actual] = true;
        const vals = Object.keys(thisKeys);

        if (vals.length != 2) return;
        else if (!!thisKeys.alt && !!thisKeys.c) agregarCargo(e);
        else if (!!thisKeys.alt && !!thisKeys.d) eliminarCompra(e);
        else if (!!thisKeys.alt && !!thisKeys.e) editarCompra(e);
        else if (!!thisKeys.alt && !!thisKeys.p) agregarPago(e);
        else if (!!thisKeys.alt && !!thisKeys.v) revisarPagos(e);
    }

    return {
        styles, imgLink, 
        cargandoCompra, 
        compra_id, compra, convertLink: f.general.convertLink, creadorCompra, 
        imagenes, articulos, 
        toogleDetailView, detailView,
        cargosExtra, cargosCompra, cargosExtraTotal, cargosTotal, cargosCompraTotal, 
        pagosExtra, pagosCompra, pagosExtraTotal, pagosTotal, pagosCompraTotal, 
        pagos_pendientes, 
        cargoView, changeCargoView, 
        cargoListView, cargoTotalView, 
        pagoView, changePagoView,
        pagoListView, pagoTotalView,
        actualImage, indexImage, lenImages, chageImageSelected, 
        usuarios, 
        agregarCargo, agregarPago, 
        showAgregarCargo, showAgregarPago, showRevisarPagos, 
        newCargo, updateNewCargo, upgradePerUserCargo, 
        guardarCargo, totalNewCargoFinal, guardandoCargo, 
        newPago, updateNewPago, upgradePerUserPago, 
        guardarPago, totalNewPagoFinal, guardandoPago, 
        validaMK, keyExec, closeModals, 
        ordenar, validarOrdenTable: f.general.tables.validarOrden, 
        revisarPagos, validarPago, 
        editarCompra, eliminarCompra, 
        filtroUser, actualizarFiltroUser, usuariosUnicos, 
    }
}

const useMyEffects = props => {
    const { f } = useStates();
    const { compra_id, chageImageSelected, imagenes, newCargo, usuarios } = useVars();

    useEffect(()  => {
        f.compras.getCompra(compra_id);
    }, [compra_id]);

    useEffect(() => {
        chageImageSelected(0);
    }, [compra_id, imagenes.length]);

    // useEffect(() => {
    //     let total = 0;
    //     usuarios.map(u => {
    //         const { perUser={} } = newCargo;
    //         const value = perUser[u.id_usuario] ?? Number(u.porcentaje * newCargo.total / 100);
    //         total += Number(value);
    //     });
    //     const abs = Math.abs(total - newCargo.total);
    //     // if (abs > 5) f.u3('compras', 'newCargo', 'data', 'total', total);
    // }, [newCargo.total, newCargo.perUser, usuarios]);
}


export { useVars, useMyEffects };