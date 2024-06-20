import { useEffect, useMemo } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { Link } from 'react-router-dom';
import { Stair as StairLoading } from '../../../Components/Loaders/Stair';

import styles from '../styles/index.module.scss';

const Login = props => {
    const { s, f, gs } = useStates();

    const data = useMemo(() => s.users?.login?.form || {}, [s.users?.login?.form]);
    const ingresando = useMemo(() => !!s.loadings?.users?.login, [s.loadings?.users?.login]);

    const items = useMemo(() => [
        { key: 'user', label: 'Usuario/Correo', type: 'text', value: data.user, required: true },
        { key: 'passwd', label: 'Contraseña', type: 'password', value: data.passwd, required: true },
    ], [data]);

    const validForm = useMemo(() => {
        const required = items.filter(item => item.required);
        return required.every(item => !!item.value);
    }, [items, data]);

    const upgradeData = (key, value) => {
        f.u3('users', 'login', 'form', key, value);
    }

    const ingresar = e => {
        if (!!e) e.preventDefault();
        if (!validForm) return;
        f.users.login();
    }

    useEffect(() => {
        f.u2('users', 'login', 'form', {});
    }, []);

    if (ingresando) return <StairLoading />;

    return (
        <div className="flex justify-center flex-wrap items-center">
            <h1 className="w-full text-center text-2xl font-bold mb-5">Login</h1>
            <form className={`flex flex-wrap justify-content-center ${styles.form}`} onSubmit={ingresar}>
                {items.map((item, index) => (
                    <div key={index} className={`${gs.my_input} w-full`}>
                        <div className={`${gs.input_content}`}>
                            <label htmlFor={item.key}>{item.label}</label>
                            <input
                                type={item.type}
                                value={item.value || ''}
                                onChange={e => upgradeData(item.key, e.target.value)}
                                />
                        </div>
                    </div>
                ))}
                <div className="w-full flex justify-center">
                    <div className={`${gs.my_input} w-full`}>
                        <div className={`${gs.input_content}`}>
                            {validForm ?
                            <input
                                type="submit"
                                value="Ingresar"
                                /> :
                            <input
                                type="submit"
                                disabled
                                className={`${gs.disabled}`}
                                value="Ingresar"
                                />
                            }
                        </div>
                    </div>
                </div>
            </form>
            <small className='w-full flex justify-center mt-1'>
                <Link className='text-blue-500 hover:underline'
                    to="/users/register">
                    Registrarse
                </Link>
            </small>
        </div>
    );
}

export { Login };