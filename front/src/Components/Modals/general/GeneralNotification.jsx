import { useEffect, useMemo } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { GeneralModal } from '../GeneralModal';

const colors = {
    success: 'var(--mn)',
    danger: 'var(--cy)',
    warning: 'var(--jh)',
    info: 'var(--ty)',
}

const Content = props => {
    const { ls, s, f } = useStates();

    const { color, message, title } = useMemo(() => {
        return {
            color: colors[s.general?.notification?.mode] ?? 'var(--my-minor)',
            title: s.general?.notification?.title || '',
            message: s.general?.notification?.message || '',
        }
    }, [s.general?.notification?.mode, s.general?.notification?.message, s.general?.notification?.message]);

    const close = () => {
        f.u2('modals', 'general', 'notification', false);
    }

    return (
        <div className='w-full flex flex-wrap'>
            {!!title && 
            <h3 className='w-full text-center text-xl font-bold px-8'>
                {title}
            </h3>}
            {!!message && 
            <p className='w-full text-start px-8 mt-4'>
                {message}
            </p>}
            <div className='w-full text-center'>
                <button 
                    className="w-1/3 rounded px-4 py-2 mt-5"
                    style={{backgroundColor: color}}
                    onClick={close}>
                    Cerrar
                </button>
            </div>
        </div>
    )
}

const GeneralNotification = props => {
    const { s } = useStates();
    const { zindex, lvl1, lvl2 } = useMemo(() => {
        return {
            zindex: props?.zIndex || 999999999,
            lvl1: "general",
            lvl2: "notification",
        }
    }, []);

    const borderColor = useMemo(() => {
        return colors[s.general?.notification?.mode] ?? 'var(--my-minor)';
    }, [s.general?.notification?.mode]);

    return (
        <GeneralModal
            zindex={zindex}
            lvl1={lvl1}
            lvl2={lvl2}
            Component={Content}
            borderColor={borderColor}
            border={"2px"}
            {...props}
        />
    )
}

export { GeneralNotification };