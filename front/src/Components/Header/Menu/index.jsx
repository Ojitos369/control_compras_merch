import { useMemo, useEffect } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { HamburgerButton } from '../../Buttons';
import { GeneralModal } from '../../Modals/GeneralModal';
import { MenuModal } from './MenuModal';

const Menu = props => {
    const { s, f } = useStates();
    const { styles } = props;
    const value = useMemo(() => !!s.modals?.header?.showMenu, [s.modals?.header?.showMenu]);
    const [ComponentMenu, keyExec] = useMemo(() => {
        let C = MenuModal;
        let keyExec = true;
        return [C, keyExec];
    }, [s.menu?.modal?.mode]);

    const update = value => {
        f.u2('modals', 'header', 'showMenu', value);
    }
    const onClick = e => {
        if (!!e) e.preventDefault();
        f.u2('modals', 'header', 'showMenu', !value);
    }

    useEffect(() => {
        f.u2('menu', 'modal', 'mode', 'menu');
    }, [s.modals?.header?.showMenu])

    return (
        <>
            <HamburgerButton
                value={value}
                update={update}
                onClick={onClick}
                />

            {s.modals?.header?.showMenu &&
            <GeneralModal
                Component={ComponentMenu}
                lvl1={'header'}
                lvl2={'showMenu'}
                modal_container_w="50"
                styles={styles}
                keyExec={keyExec}
                />}
        </>
    )
}

export { Menu }


/* 
contenedor_general (flex flex-wrap)
    datos [foma de pago / precios en / tiempo de entrega / lab] (flex flex-wrap width-full)
        p (w-auto)
    form [defina el tiempo de entrega / libro abordo] (flex width-full)
    lista (w-full)
        ul: (flex flex-direction-column items-start w-full)
        li: (flex)
    
    Otros datos (flex flex-column flex-wrap)
        p: Con atencion... (w-full)
        datos_extra (flex w-full)
            firma (flex w-1/2)
                ...
            datos_contacto (flex w-1/2 flex-column)
                email (flex w-full)
                telefono (flex w-full)



*/