import { useMemo } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { useKeyDown, useKeyUp, useLocalTab } from '../../../Hooks/myHooks';
import { Stair } from '../../Loaders/Stair';
import { useEffect } from 'react';
import { ChevronsLeft } from '../../Icons';

const ListenKeys = props => {
    const { keyExec } = props;
    // ---------------------------------------------   KEYBOARD EVENTS   --------------------------------------------- #
    useKeyDown(props.unLogin, ['escape'], keyExec);
    useKeyUp(null, ['any'], keyExec);
    // ---------------------------------------------   /KEYBOARD EVENTS   --------------------------------------------- #

    return null;
}

const Login = props => {
    const { s, f } = useStates();
    const { styles } = props;
    const keyExec = s.menu?.modal?.mode === 'login';
    const messageError = useMemo(() => s.menu?.login?.error || '', [s.menu?.login?.error]);
    const loging = useMemo(() => !!s.loaders?.login?.login || '', [s.loaders?.login?.login]);
    // const messageError = s.menu?.login?.error || '';

    const unLogin = () => {
        console.log("saliendo login")
        f.u2('menu', 'modal', 'mode', 'menu');
    }

    const login = e => {
        if (!!e) e.preventDefault();
        f.login.login();
    }

    useEffect(() => {
        f.u2('menu', 'login', 'error', '');
    }, []);

    if (loging) {
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
                unLogin={unLogin}
            />}
            <span className='w-[30px] m-3'>
                <ChevronsLeft
                    onClick={unLogin}
                    />
            </span>
            <form 
                className={`${styles.login} w-full flex flex-col items-center mt-2`}
                onSubmit={login}
                >
                <p className='w-full text-center text-3xl font-bold'>
                    Login
                </p>

                <div className={`${styles.input_element}`}>
                    <label className={`${styles.input_label}`} htmlFor="">User</label>
                    <input 
                        className={`${styles.input}`} 
                        type="text"
                        name='user'
                        value={s.menu?.login?.user || ''}
                        onChange={e => f.u2('menu', 'login', 'user', e.target.value)}
                        />
                </div>

                <div className={`${styles.input_element}`}>
                    <label className={`${styles.input_label}`} htmlFor="">Password</label>
                    <input 
                        className={`${styles.input}`} 
                        type="password"
                        name='password'
                        value={s.menu?.login?.password || ''}
                        onChange={e => f.u2('menu', 'login', 'password', e.target.value)}
                        />
                </div>

                <div className={`${styles.submit_element}`}>
                    <input
                        type='submit'
                        className={`${styles.input_button} bg-blue-500 hover:bg-blue-600`}
                        value='Login'
                        />
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

export { Login }
