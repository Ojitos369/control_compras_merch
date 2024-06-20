import { useEffect, useMemo } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { Link } from 'react-router-dom';
import { DobleLoader } from '../../../Components/Loaders/DobleLoader';

import styles from '../styles/index.module.scss';

// nombre, paterno, materno, passwd, confirm passwd, correo, telefono, fecha_nacimiento
const Register = props => {
    const { s, f, gs } = useStates();

    const data = useMemo(() => s.users?.register?.form || {}, [s.users?.register?.form]);

    const registrando = useMemo(() => !!s.loadings?.users?.register, [s.loadings?.users?.register]);

    const items = useMemo(() => [
        { key: 'nombre', label: 'Nombre', type: 'text', value: data.nombre },
        { key: 'paterno', label: 'Apellido Paterno', type: 'text', value: data.paterno },
        { key: 'materno', label: 'Apellido Materno', type: 'text', value: data.materno },
        { key: 'user', label: 'Usuario', type: 'text', value: data.user, 
            required: true, errorMessage: !data.user && 'Este Campo es requerido'
        },
        { key: 'passwd', label: 'Contraseña', type: 'password', value: data.passwd, 
            required: true, errorMessage: !data.passwd && 'Este Campo es requerido'
        },
        { key: 'confirmPasswd', label: 'Confirmar Contraseña', type: 'password', value: data.confirmPasswd,
            required: true, errorMessage: !!data.passwd ? (data.passwd === data.confirmPasswd ? '' : 'Las contraseñas no coinciden') : ''
        },
        { key: 'correo', label: 'Correo', type: 'email', value: data.correo, 
            required: true, errorMessage: !data.correo && 'Este Campo es requerido'
        },
        { key: 'telefono', label: 'Teléfono', type: 'tel', value: data.telefono },
        { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento', type: 'date', value: data.fecha_nacimiento },
    ], [data]);

    const validForm = useMemo(() => {
        const required = items.filter(item => item.required);
        return required.every(item => !!item.value);
    }, [items, data]);

    const upgradeData = (key, value) => {
        f.u3('users', 'register', 'form', key, value);
    }

    const registrarse = e => {
        if (!!e) e.preventDefault();
        if (!validForm) return;
        f.users.register();
    }

    useEffect(() => {
        f.u2('users', 'register', 'form', {});
    }, []);

    if (registrando) return <DobleLoader />;
    return (
        <div className="flex justify-center flex-wrap items-center">
            <h1 className="w-full text-center text-2xl font-bold mb-5">Registro</h1>
            <form className={`flex flex-wrap justify-content-center ${styles.form}`} onSubmit={registrarse}>
                {items.map((item, index) => (
                    <div key={index} className={`${gs.my_input}`}>
                        <div className={`${gs.input_content}`}>
                            <label htmlFor={item.key}>{item.label}</label>
                            <input
                                type={item.type}
                                value={item.value || ''}
                                onChange={e => upgradeData(item.key, e.target.value)}
                                />
                            {item.errorMessage && <small className={`${gs.dangerError}`}>{item.errorMessage}</small>}
                        </div>
                    </div>
                ))}
                <div className="w-full flex justify-center">
                    <div className={`${gs.my_input}`}>
                        <div className={`${gs.input_content}`}>
                            {validForm ?
                            <input
                                type="submit"
                                value="Registrarse"
                                /> :
                            <input
                                type="submit"
                                disabled
                                className={`${gs.disabled}`}
                                value="Registrarse"
                                />
                            }
                        </div>
                    </div>
                </div>
            </form>
            <small className='w-full flex justify-center mt-1'>
                <Link className='text-blue-500 hover:underline'
                    to="/users/login">
                    Ingresar
                </Link>
            </small>
        </div>
    );
}
export { Register };