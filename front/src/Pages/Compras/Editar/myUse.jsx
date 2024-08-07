import { useEffect, useMemo } from "react";
import { useStates } from "../../../Hooks/useStates";
import { useParams } from "react-router-dom";

const useVars = props => {
    const { s, f } = useStates();
    const { compra_id } = useParams();

    // ---------------------------------------------   FUNCTIONS   --------------------------------------------- #
    const guardando = useMemo(() => s.loadings?.compras?.guardarCompra, [s.loadings?.compras?.guardarCompra]);
    const compraData = useMemo(() => s.compras?.consulta?.compraData || {}, [s.compras?.consulta?.compraData]);
    const imgLink = useMemo(() => s.general?.imagesLink || '', [s.general?.imagesLink]);

    const images = useMemo(() => s.compras?.actualCompra?.form?.images || [], [s.compras?.actualCompra?.form?.images]);
    const total = useMemo(() => s.compras?.actualCompra?.form?.total || 0, [s.compras?.actualCompra?.form?.total]);
    const actualImage = useMemo(() => s.compras?.actualCompra?.actualImage, [s.compras?.actualCompra?.actualImage]);

    const valid = useMemo(() => {
        const items = s.compras?.actualCompra?.form?.items || [];
        const items_valid_fields = items.every(item => !!item.cantidad && !!item.precio && !!item.descripcion_compra);
        const items_valid_length = items.length > 0;
        const valid_name = !!s.compras?.actualCompra?.form.nombre_compra;
        return items_valid_fields && items_valid_length && valid_name;
    }, [s.compras?.actualCompra?.form?.items, s.compras?.actualCompra?.form.nombre_compra]);

    const fields = useMemo(() => [
        {label: 'Usuario', name: 'usuario', type: 'text',
            default: s.login?.data?.user?.usuario ?? '',
        },
        {label: 'Descripcion', name: 'descripcion_compra', type: 'text',
            required: true
        },
        {label: 'Cantidad', name: 'cantidad', type: 'text',
            required: true
        },
        {label: 'Precio', name: 'precio', type: 'text',
            required: true
        },
    ], [s.login?.data?.user?.usuario]);

    const generalFields = useMemo(() => {
        const data = s.compras?.actualCompra?.form || {};
        return [
            {label: 'Nombre', name: 'nombre_compra', type: 'text', value: data.nombre_compra,
                required: true
            },
            {label: 'Descripcion', name: 'descripcion_compra', type: 'text', value: data.descripcion_compra},
            {label: 'Link', name: 'link', type: 'text', value: data.link,
                placeholder: 'fb.com/..., jp.mercari.com/...'
            },
            {label: 'Origen', name: 'origen', type: 'text', value: data.origen,
                placeholder: 'Kyototo, Shyshy, Infieles, ...'
            },
            {label: 'Fecha Limite', name: 'fecha_limite', type: 'date', value: data.fecha_limite
            },
        ]
    }, [s.compras?.actualCompra?.form])

    const {items, totalItems} = useMemo(() => {
        const items = (s.compras?.actualCompra?.form?.items || []).map(d => {
            const item = {};
            fields.forEach(f => {
                item[f.name] = d[f.name] || (f.default ?? null);
            });
            if (!!d.id_compra_det) item.id_compra_det = d.id_compra_det;
            return item;
        });

        const totalItems = items.reduce((acc, item) => {
            return acc + parseFloat(item.cantidad || 0);
        }, 0);

        return {items, totalItems};
    }, [s.compras?.actualCompra?.form?.items]);
    // console.log('items', items);

    const keyExec = useMemo(() => {
        const keysCompras = Object.keys(s.modals?.compras || {});
        const keysGeneral = Object.keys(s.modals?.general || {});
        const comprasOpen = keysCompras.some(k => !!s.modals?.compras[k]);
        const generalOpen = keysGeneral.some(k => !!s.modals?.general[k]);
        const valid = !(comprasOpen || generalOpen);
        return valid;
    }, [s.modals?.compras, s.modals?.general]);

    const keys = useMemo(() => s.shortCuts?.keys || {}, [s.shortCuts?.keys]);


    // ---------------------------------------------   FUNCTIONS   --------------------------------------------- #
    const deleteActualImage = e => {
        if (!!e) e.preventDefault();
        // actualImage.id_image
        f.compras.eliminarImagen(actualImage.id_image, setActualImage);
    }

    const validaMK = e => {
        let thisKeys = f.cloneO(keys);
        const actual = e.key.toLowerCase();
        thisKeys[actual] = true;
        const vals = Object.keys(thisKeys);

        if (vals.length != 2) return;
        else if (!!thisKeys.alt && !!thisKeys.a) addNew(e);
        else if (!!thisKeys.alt && !!thisKeys.enter) save(e);
    }

    const save = e => {
        if (!!e) e.preventDefault();
        if (valid) {
            f.compras.guardarCompra();
        }
    }

    const addNew = e => {
        if (!!e) e.preventDefault();
        // s.compras?.actualCompra?.form
        let newItem = {}
        fields.forEach(f => {
            newItem[f.name] = (f.default ?? null);
        });

        let newItems = [...items, newItem];
        f.u3('compras', 'actualCompra', 'form', 'items', newItems);
        
        const len = newItems.length;
        const id = `descripcion_compra_${len - 1}`;
        setTimeout(() => {
            const input = document.getElementById(id);
            if (!!input) input.focus();
        }, 100);
    }

    const upgradeData = (index, key, value) => {
        let newItems = f.cloneO(items);
        newItems[index][key] = value;
        f.u3('compras', 'actualCompra', 'form', 'items', newItems);
    };

    const upgradeGeneralData = (key, value) => {
        f.u3('compras', 'actualCompra', 'form', key, value);
    }

    const removeItem = index => {
        let newItems = f.cloneO(items);
        newItems.splice(index, 1);
        f.u3('compras', 'actualCompra', 'form', 'items', newItems);
    };

    const setActualImage = image => {
        f.u2('compras', 'actualCompra', 'actualImage', image);
    }

    const cambiarImage = newIndex => {
        const index = newIndex < 0 ? images.length - 1 : newIndex >= images.length ? 0 : newIndex;
        setActualImage(images[index]);
    }

    const clickInput = () => {
        const input = document.getElementById('temp-file');
        input.value = '';
        input.click();
    }

    return { 
        compra_id, compraData, 
        guardando, valid, fields, 
        generalFields, upgradeGeneralData, 
        items, totalItems, 
        images, actualImage, 
        keyExec, validaMK, deleteActualImage, 
        save, addNew, upgradeData, removeItem, 
        setActualImage, cambiarImage, clickInput, 
        total, imgLink, 
    }
}


const useMyEffects = props => {
    const { f } = useStates();
    const { 
        compra_id, compraData, imgLink, 
        images, actualImage, cambiarImage, setActualImage, items
    } = useVars();

    useEffect(() => {
        f.u1('shortCuts', 'keys', {});
        f.compras.validarImagenesNoGuardadas();
    }, []);

    useEffect(() => {
        if (images.length > 0 && !actualImage) {
            cambiarImage(0)
        }
        else if (!images.length) {
            setActualImage(null);
        }

    }, [compra_id, images]);

    useEffect(() => {
        const total = items.reduce((acc, item) => {
            return acc + (parseFloat(item.cantidad || 0) * parseFloat(item.precio || 0));
        }, 0);
        f.u3('compras', 'actualCompra', 'form', 'total', total);

    }, [items]);

    useEffect(()  => {
        f.compras.getCompra(compra_id);
    }, [compra_id]);

    useEffect(() => {
        console.log('compraData', compraData);
        if (!Object.keys(compraData).length) {
            f.u1('compras', 'actualCompra', null);
            return;
        };

        const { articulos, imagenes, compra } = compraData;
        const { id_compra, nombre_compra, descripcion_compra, link, origen, total } = compra;
        let fecha_limite;
        if (!!compra.fecha_limite) { 
            fecha_limite = compra.fecha_limite.split('T')[0];
        }
        let images = [];
        if (imagenes) {
            images = imagenes.map((img, index) => {
                const name = img.filename;
                const url = `${imgLink}/${compra_id}/preview/${name}`;
                return {
                    index, url, name, id_image: img.id_imagen
                }
            });
        }
        const items = articulos.map(a => {
            const { usuario, descripcion: descripcion_compra, cantidad, precio, id_compra_det } = a;
            return { usuario, descripcion_compra, cantidad, precio, id_compra_det };
        });
        const compraActual = {
            id: id_compra, nombre_compra, descripcion_compra, link, origen, fecha_limite, total, items, images
        }
        f.u2('compras', 'actualCompra', 'form', compraActual);
    }, [compraData]);
}


export { useVars, useMyEffects };