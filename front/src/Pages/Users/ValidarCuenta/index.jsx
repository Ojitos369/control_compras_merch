// validar_cuenta
import { useEffect, useMemo } from 'react';
import { useStates } from '../../../Hooks/useStates';
import { SendingCubes } from '../../../Components/Loaders/SendingCubes';

import styles from '../styles/index.module.scss';

import { useParams } from 'react-router-dom';

const ValidarCuenta = props => {
    // props validacion
    const { validacion } = useParams();
    const { f, s } = useStates();
    const validando = useMemo(() => !!s.loadings?.users?.validarCuenta, [s.loadings?.users?.validarCuenta]);

    useEffect(() => {
        if (!validacion) return;
        f.users.validarCuenta(validacion);
    }, [validacion]);

    if (validando) return <SendingCubes />;

    return (
        <div className="flex justify-center flex-wrap items-center">
            <h1 className="w-full text-center text-2xl font-bold mb-5">Validar Cuenta</h1>
        </div>
    );
};

export { ValidarCuenta }