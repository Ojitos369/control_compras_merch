import { useStates } from "../../../Hooks/useStates";
import { useEffect, useMemo } from "react";
import { Images } from "./Images";
import { Generales } from "./Generales";
import { Articulos } from "./Articulos";
import { Resumen } from "./Resumen";
import { useKeyDown, useKeyUp } from "../../../Hooks/myHooks";
import { ColorsCubesUpdate } from "../../../Components/Loaders/ColorsCubesUpdate";
import styles from './styles/index.module.scss';


const ListenKeys = props => {
    const { keyExec } = props;
    // ---------------------------------------------   KEYBOARD EVENTS   --------------------------------------------- #
    useKeyDown(props.validaMK, ['alt', 'a', 'enter'], keyExec);

    useKeyUp(null, ['any'], keyExec);
    // ---------------------------------------------   /KEYBOARD EVENTS   --------------------------------------------- #

    return null;
}

const Nueva = props => {
    const { s, f, gs } = useStates();

    const { 
        data, guardando, valid, fields, items, 
        images, actualImage, 
        keyExec, keys
    } = useVars({ s });

    const { 
        validaMK, 
        save, addNew, upgradeData, removeItem, 
        setActualImage, cambiarImage, clickInput, 
    } = useFuntions({ 
        f, keys, 
        valid, fields, items, 
        images
    });

    useMyEffects({
        s, f,
        images, actualImage, cambiarImage, setActualImage
    });

    if (guardando) {
        return (
            <ColorsCubesUpdate />
        )
    }

    return (
        <section className={`flex flex-row flex-wrap justify-center w-full ${styles.nueva_compra_container} py-4`}>
            {keyExec && 
            <ListenKeys 
                keyExec={keyExec}
                validaMK={validaMK}
            />}

            <Images 
                f={f} styles={styles}
                images={images}
                actualImage={actualImage}
                cambiarImage={cambiarImage}
                clickInput={clickInput}
            />
            <Generales s={s} f={f} gs={gs} styles={styles} data={data}/>
            <Articulos 
                s={s} 
                f={f} 
                gs={gs} 
                styles={styles} 
                items={items} 
                addNew={addNew} 
                upgradeData={upgradeData}
                removeItem={removeItem}
                fields={fields}/>
            <Resumen s={s} f={f} gs={gs} styles={styles} data={data} save={save} valid={valid}/>
        </section>
    )
}

const useVars = props => {
    const { s } = props; 
    const data = useMemo(() => s.compras?.actualCompra?.form || {}, [s.compras?.actualCompra?.form]);
    const guardando = useMemo(() => s.loadings?.compras?.guardarCompra, [s.loadings?.compras?.guardarCompra]);

    const valid = useMemo(() => {
        const items = s.compras?.actualCompra?.form?.items || [];
        const items_valid_fields = items.every(item => !!item.cantidad && !!item.precio && !!item.descripcion_compra);
        const items_valid_length = items.length > 0;
        const valid_name = !!s.compras?.actualCompra?.form.nombre_compra;
        return items_valid_fields && items_valid_length && valid_name;
    }, [s.compras?.actualCompra?.form?.items, s.compras?.actualCompra?.form.nombre_compra]);

    const fields = useMemo(() => [
        {label: 'Usuario', name: 'usuario', type: 'text',
            default: s.login?.data?.user?.usuario || '',
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

    const items = useMemo(() => {
        const items = (s.compras?.actualCompra?.form?.items || []).map(d => {
            const item = {};
            fields.forEach(f => {
                item[f.name] = d[f.name] || (f.default ?? null);
            });
            return item;
        })

        return items;
    }, [s.compras?.actualCompra?.form?.items]);

    const images = useMemo(() => s.compras?.actualCompra?.form?.images || [], [s.compras?.actualCompra?.form?.images]);
    const actualImage = useMemo(() => s.compras?.actualCompra?.actualImage, [s.compras?.actualCompra?.actualImage]);

    const keyExec = useMemo(() => {
        const keysCompras = Object.keys(s.modals?.compras || {});
        const keysGeneral = Object.keys(s.modals?.general || {});
        const comprasOpen = keysCompras.some(k => !!s.modals?.compras[k]);
        const generalOpen = keysGeneral.some(k => !!s.modals?.general[k]);
        const valid = !(comprasOpen || generalOpen);
        console.log('valid', valid);
        return valid;
    }, [s.modals?.compras, s.modals?.general]);

    const keys = useMemo(() => s.shortCuts?.keys || {}, [s.shortCuts?.keys]);

    return { 
        data, guardando, valid, fields, items, 
        images, actualImage, 
        keyExec, keys
    }
}

const useFuntions = props => {
    const { 
        f, keys, 
        valid, fields, items, 
        images, 
    } = props;

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
        validaMK, 
        save, addNew, upgradeData, removeItem, 
        setActualImage, cambiarImage, clickInput, 
    };
}

const useMyEffects = props => {
    const { 
        s, f, 
        images, actualImage, cambiarImage, setActualImage 
    } = props;

    useEffect(() => {
        const id = f.general.getUuid();
        f.u2('compras', 'actualCompra', 'form', {id});
        f.u3('compras', 'actualCompra', 'form', 'images', null);
        f.u1('shortCuts', 'keys', {});
        f.compras.validarImagenesNoGuardadas();

        const idName = 'nombre_compra';
        const input = document.getElementById(idName);
        if (!!input) {
            input.focus();
        }
    }, []);


    useEffect(() => {
        if (images.length > 0 && !actualImage) {
            cambiarImage(0)
        }
        else if (!images.length) {
            setActualImage(null);
        }

    }, [images]);
}

export { Nueva };