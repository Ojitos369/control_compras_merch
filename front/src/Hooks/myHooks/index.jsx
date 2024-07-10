import { useEffect, useMemo } from 'react';
import { useStates } from '../useStates';

const useKeyDown = (callback, keys, keyExec, extras) => {
    const element = document;
    const { s, f } = useStates();
    const functionBlocked = useMemo(() => s.shortCuts?.functionBlocked || false, [s.shortCuts?.functionBlocked]);
    const press = extras?.press || [];
    const sendEvent = extras?.sendEvent ?? true;
    const onKeyDown = (event) => {
        if (!keyExec || functionBlocked) return;
        const s_keys = s.shortCuts?.keys || {};
        const evKey = event?.key?.toLowerCase();
        const evCode = event?.code?.toLowerCase();
        const evKeyCode = event?.keyCode;
        const valids = [evKey, evCode, evKeyCode];
        const actualKeys = Object.keys(s_keys);
        if (!(keys.some(key => press.includes(key.toLowerCase())))) {
            if (actualKeys.includes(evKey)) return;
        }

        const wasAnyKeyPressed = keys.some((key) => valids.includes(key.toLowerCase()));
        if (wasAnyKeyPressed) {
            let keys = {
                ...s_keys,
                [evKey]: true,
            }
            f.u1('shortCuts', 'keys', keys);
            if (!!callback) {
                if (sendEvent) {
                    callback(event);
                } else {
                    callback();
                }
            }
        }
    };
    useEffect(() => { 
        if (!keyExec) return;
        element.addEventListener('keydown', onKeyDown);
        return () => {
            element.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown, keyExec]);
};

const useKeyUp = (callback, keys, keyExec, extras) => {
    const element = document;
    const { s, f } = useStates();
    const functionBlocked = useMemo(() => s.shortCuts?.functionBlocked || false, [s.shortCuts?.functionBlocked]);
    const onKeyUp = (event) => {
        if (!keyExec || functionBlocked) return;
        const s_keys = s.shortCuts?.keys || {};
        const evKey = event?.key?.toLowerCase();
        const evCode = event?.code?.toLowerCase();
        const evKeyCode = event?.keyCode;
        const valids = [evKey, evCode, evKeyCode];
        const wasAnyKeyPressed = keys.some((key) => valids.includes(key.toLowerCase())) || keys.includes('any');
        if (wasAnyKeyPressed) {
            // event.preventDefault();
            let keys = {
                ...s_keys,
            }
            delete keys[evKey];
            f.u1('shortCuts', 'keys', keys);
            if (!!callback) callback(event);
        }
    };
    useEffect(() => { 
        if (!keyExec) return;
        element.addEventListener('keyup', onKeyUp);
        return () => {
            element.removeEventListener('keyup', onKeyUp);
        };
    }, [onKeyUp, keyExec]);
};

const useLocalTab = (modalItem, modalRef, autoFocus=true) => {
    const { s, f } = useStates();
    useEffect(() => { 
        if (!modalItem) return;

        const handleKeyDown = (e) => {
            if (!modalRef.current) return;
            if (e.key === 'Tab') {
                const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (focusableElements.length === 0) {
                    e.preventDefault();
                    return;
                };

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus();
                }
            }
        };
        // focus first element if focus not in modal
        if ((document.activeElement !== modalRef.current) && autoFocus) {
            const firstElement = modalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            (firstElement?.focus && firstElement?.focus());
            (firstElement?.select && firstElement?.select());
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [modalItem, modalRef]);
}

const useSelectListaRefresh = props => {
    const { elegido, lista, actualizador, getDataFunc, name } = props;
    // console.log('useSelectListaRefresh', props);

    const localGetData = ele => {
        // console.log('ele', ele);
        // console.log('getData', ele, lista);
        let ele_id, mode, index, new_ele;
        if (!!ele?.ele?.id) {
            ele_id = ele?.ele?.id;
            mode = 'ele';
            index = ele?.index;
        }
        else if (!!ele?.id) {
            ele_id = ele?.id;
            mode = 'id';
            index = ele?.index;
        }
        new_ele = lista.filter(e => {
            return e.id == ele_id;
        });
        new_ele = new_ele[0] || null;
        const ci = lista.length;
        // console.log('new_ele', new_ele);
        // console.log('ci', ci);
        // console.log('index', index);
        if (!new_ele && ci > 0 && index >= 0) {
            if (ci >= index + 1) {
                new_ele = lista[index];
            } else if (index > 0) {
                // console.log('eliginedo', index, index-1);
                new_ele = lista[index - 1];
                // console.log('new_ele', new_ele);
            } else {
                new_ele = lista[0];
            }
        }

        if (mode === 'ele' && !!new_ele) {
            new_ele = {ele: new_ele, index: index};
        }
        return new_ele;
    };

    const getData = getDataFunc || localGetData;

    useEffect(() => { 
        const params = Object.keys(elegido || {});
        // console.log('params', params);
        if (lista.length > 0 && params.length > 0) {
            const new_ele = getData(elegido);
            const new_ele_str = JSON.stringify(new_ele);
            const elegido_str = JSON.stringify(elegido);
            // console.log('new_ele_str', new_ele_str);
            // console.log('elegido_str', elegido_str);
            if (new_ele_str !== elegido_str) {
                actualizador(new_ele);
            }
        }
        else {
            if (params.length > 0) {
                actualizador(null);
                // console.log('changing list 2', name, lista);
            }
        }
    }, [lista, elegido]);
}

export { 
    useKeyDown, 
    useKeyUp, 
    useLocalTab, 
    useSelectListaRefresh, 
};