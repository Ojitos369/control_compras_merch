import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStates } from '../../../Hooks/useStates';

const MenuModal = props => {
    const { s, f, lf } = useStates();
    const { styles } = props;

    const userLogged = useMemo(() => s.login?.data?.user || {}, [s.login?.data?.user]);

    const closeMemu = () => {
        f.u2('modals', 'header', 'showMenu', false);
    }
    
    return (
        <div className={`${styles.menuModal} w-full flex flex-wrap justify-center`}>
            {userLogged.token && 
            <div className={`w-10/12 px-4 py-3`}>
                <Link
                    className='w-full flex items-center justify-center py-2 px-4 rounded-md bg-[var(--ty)] hover:bg-[var(--sn)] text-black'
                    to='/compras/nueva/'
                    onClick={closeMemu}
                    >
                    <p className="">Nueva Compra</p>
                </Link>
            </div>}
            <div className="w-10/12 md:w-5/12 px-4 py-3">
                <button
                    className='w-full flex items-center justify-center py-2 px-4 rounded-md bg-[var(--tw)] hover:bg-[var(--mm)] text-black'
                    onClick={lf.toggleTheme}
                    >
                    <p className="">Toggle Theme</p>
                </button>
            </div>
            <div className="w-10/12 md:w-5/12 px-4 py-3">
                <a
                    className='w-full flex items-center justify-center py-2 px-4 rounded-md bg-[var(--mn)] hover:bg-[var(--jy)] text-black'
                    href='https://me.ojitos369.com/#/contact/'
                    target='_blank'
                    rel='noreferrer'
                    >
                    <p className="">Contacto</p>
                </a>
            </div>
            {userLogged.token ?
            <div className="w-10/12 md:w-5/12 px-4 py-3">
                <Link
                    className='w-full flex items-center justify-center py-2 px-4 rounded-md bg-[var(--cy)] hover:bg-[var(--jh)] text-white hover:text-black'
                    to='/'
                    onClick={f.users.closeSession}
                    >
                    <p className="">Logout</p>
                </Link>
            </div> :
            <>
                <div className="w-10/12 md:w-5/12 px-4 py-3">
                    <Link
                        className='w-full flex items-center justify-center py-2 px-4 rounded-md bg-[var(--ty)] hover:bg-[var(--ny)] text-white hover:text-black'
                        to='/users/login'
                        onClick={closeMemu}
                        >
                        <p className="">Login</p>
                    </Link>
                </div>
                <div className="w-10/12 md:w-5/12 px-4 py-3">
                    <Link
                        className='w-full flex items-center justify-center py-2 px-4 rounded-md bg-[var(--cy)] hover:bg-[var(--jh)] text-white hover:text-black'
                        to='/users/register'
                        onClick={closeMemu}
                        >
                        <p className="">Register</p>
                    </Link>
                </div>
            </>
            }
        </div>
    )
}

export { MenuModal }
