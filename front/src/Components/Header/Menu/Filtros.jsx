import { useMemo } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { useKeyDown, useKeyUp, useLocalTab } from '../../../Hooks/myHooks';
import { Stair } from '../../Loaders/Stair';
import { useEffect } from 'react';
import { ChevronsLeft } from '../../Icons';

const ListenKeys = props => {
    const { keyExec } = props;
    // ---------------------------------------------   KEYBOARD EVENTS   --------------------------------------------- #
    useKeyDown(props.closeFiltros, ['escape'], keyExec);
    useKeyUp(null, ['any'], keyExec);
    // ---------------------------------------------   /KEYBOARD EVENTS   --------------------------------------------- #

    return null;
}

const Filtros = props => {
    const { s, f } = useStates();
    const { styles } = props;
    const keyExec = s.menu?.modal?.mode === 'filtros';
    const messageError = useMemo(() => s.menu?.filtros?.error || '', [s.menu?.filtros?.error]);
    const loading = useMemo(() => !!s.loaders?.filtros?.filtros, [s.loaders?.filtros?.filtros]);
    const filtros = useMemo(() => s.menu?.filtros?.filtros || {}, [s.menu?.filtros?.filtros]);
    // const messageError = s.menu?.filtros?.error || '';

    const closeFiltros = () => {
        f.u2('menu', 'modal', 'mode', 'menu');
    }

    const filtrar = e => {
        if (!!e) e.preventDefault();
        f.u1('app', 'filtros', {...s.app?.filtros, ...s.menu?.filtros?.filtros});
        f.u2('modals', 'header', 'showMenu', false);
    }

    const updateFiltros = e => {
        const { name, value } = e.target;
        // console.log(name, value);
        f.u3('menu', 'filtros', 'filtros', name, value);
    }

    useEffect(() => {
        f.u2('menu', 'filtros', 'error', '');
    }, []);

    if (loading) {
        return (
            <div className='my-5 w-full flex justify-center'>
                <Stair />
            </div>
        );
    }
    
    return (
        <>
            {keyExec && 
            <ListenKeys 
                keyExec={keyExec}
                closeFiltros={closeFiltros}
            />}
            <span className={`${styles.closeAction}`}>
                <ChevronsLeft
                    onClick={closeFiltros}
                    />
            </span>

            {/* name, model, fi, ff, scale, gi, gg, cats, por_pagina */}
            <form 
                className={`${styles.filtros} w-full flex flex-col md:flex-row md:flex-wrap items-center mt-2`}
                onSubmit={filtrar}
                >
                <p className='w-full text-center text-3xl font-bold'>
                    Filtros
                </p>

                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Nombre</label>
                    <input 
                        className={`${styles.input}`} 
                        type="text"
                        name='name'
                        placeholder='mn_fd'
                        value={filtros?.name || ''}
                        onChange={updateFiltros}
                        />
                </div>
                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Model</label>
                    <input 
                        className={`${styles.input}`} 
                        type="text"
                        name='model'
                        placeholder='ScUNET'
                        value={filtros?.model || ''}
                        onChange={updateFiltros}
                        />
                </div>
                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Fecha Inicial</label>
                    <input 
                        className={`${styles.input}`} 
                        type="date"
                        name='fi'
                        value={filtros?.fi || ''}
                        onChange={updateFiltros}
                        />
                </div>
                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Fecha Final</label>
                    <input 
                        className={`${styles.input}`} 
                        type="date"
                        name='ff'
                        value={filtros?.ff || ''}
                        onChange={updateFiltros}
                        />
                </div>
                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Escala</label>
                    <input 
                        className={`${styles.input}`} 
                        type="text"
                        name='scale'
                        placeholder='4'
                        value={filtros?.scale || ''}
                        onChange={updateFiltros}
                        />
                </div>  
                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Grupo Imagen</label>
                    <input 
                        className={`${styles.input}`} 
                        type="text"
                        name='gi'
                        placeholder='mn_fd_1'
                        value={filtros?.gi || ''}
                        onChange={updateFiltros}
                        />
                </div>
                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Grupo General</label>
                    <input 
                        className={`${styles.input}`} 
                        type="text"
                        name='gg'
                        placeholder='mn_fd'
                        value={filtros?.gg || ''}
                        onChange={updateFiltros}
                        />
                </div>
                <div className={`${styles.input_element} w-8/12 md:w-3/12 p-2 px-5`}>
                    <label className={`${styles.input_label}`} htmlFor="">Categorias</label>
                    <input 
                        className={`${styles.input}`} 
                        type="text"
                        name='cats'
                        placeholder='Mina, 4x, ...'
                        value={filtros?.cats || ''}
                        onChange={updateFiltros}
                        />
                </div>

                <div className={`${styles.submit_element} flex flex-col md:flex-row w-8/12 md:w-3/12 p-2 px-5 items-center md:justify-around`}>
                    <input
                        type='submit'
                        className={`${styles.input_button} bg-blue-500 hover:bg-blue-600 w-8/12 md:w-1/4 mb-6`}
                        value='Filtrar'
                        />
                    
                    <span 
                        className={`manita ${styles.input_button} bg-red-500 hover:bg-red-600 w-8/12 md:w-1/4 mb-6`}
                        onClick={e => {
                            e.preventDefault();
                            f.u2('menu', 'filtros', 'filtros', {});
                            f.u1('app', 'filtros', {});
                        }}
                        >
                        Limpiar Filtros
                    </span>
                </div>

                {messageError &&
                <div className={`${styles.error_message}`}>
                    <small className={`${styles.message}`}>
                        {messageError}
                    </small>
                </div>
                }
            </form>
        </>
    )
}

export { Filtros }
